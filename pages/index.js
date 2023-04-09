import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import app from "../firebase";
import Link from "next/link";
import toast from "react-simple-toasts";
import firebase from 'firebase/app'


export default function Home() {
  const [journalEntry, setJournalEntry] = useState("");
  const [result, setResult] = useState();
  const [currEntry, setCurrEntry] = useState([]);
  const [email, setEmail] = useState();

  const today = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);
  const currentTime = today.getTime();

  const signInWithGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log(user);

        setEmail(user.email);
      });
  }

  function signOut() {
    firebase
    .auth()
    .signOut()
    .then(function (result) {
      setEmail(false);
      console.log(result);
    });
  }



  function submitJournal() {
    app
      .database()
      .ref("journal-entries")
      .child(currentTime)
      .set({
        name: "Amrita Venkatraman",
        date: formattedDate,
        time: currentTime,
        entry: currEntry,
      })
      .catch(alert);
    toast("Journal Saved!");
  }

  async function onSubmit(event) {
    event.preventDefault();
    currEntry.push(journalEntry);
    try {
      const response = await fetch("/api/generate", {
        // refers to generate.js in the api folder in this project
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ journal: journalEntry }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setJournalEntry("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Enhanced Journal</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <Link href={`/posts/entries`}>Entries</Link>
        <button onClick={signInWithGoogle}>Sign In With Google</button>
        {email ? (
          <button onClick={signOut}>Sign Out</button>
        ) : (
          <></>
        )}
        <h3>Today is {formattedDate}.</h3>
        {result ? (
          <h2 className={styles.result}>{result}</h2>
        ) : (
          <h2 className={styles.result}>How are you feeling today?</h2>
        )}
        <form onSubmit={onSubmit}>
          <textarea
            className={styles.textarea}
            type="text"
            name="journalEntry"
            placeholder="Start typing..."
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
          />
          <input type="submit" value="Submit Entry" />
        </form>
        <br></br>
        <h2>My Current Entry: </h2>
        <p>{currEntry.map((entry) => entry.trim()).join(" ")}</p>
        <button className={styles.save} onClick={(e) => submitJournal(e)}>
          Save Entry
        </button>
      </main>
    </div>
  );
}
