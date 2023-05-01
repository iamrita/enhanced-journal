import Head from "next/head";
import { useState} from "react";
import styles from "./index.module.css";
import app from "../firebase";
import Link from "next/link";
import toast from "react-simple-toasts";
import firebase from "firebase/app";
import { Button, Typography, Form, Input } from "antd";

const { Title, Text } = Typography;

export default function JournalScreen(props) {
  const [journalEntry, setJournalEntry] = useState("");
  const [result, setResult] = useState();
  const [currEntry, setCurrEntry] = useState([]);
  const [email, setEmail] = useState();
  const [isModified, setIsModified] = useState(false);

  const today = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);
  const currentTime = today.getTime();

  const handleTextareaChange = (event) => {
    setIsModified(true);
    setJournalEntry(event.target.value);
  };

  const handlePressEnter = (event) => {
    if (event.keyCode === 13) {
      // Enter key
      event.preventDefault();
      submitEntry();
    }
  };

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
  };

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
    const newId = props.email.replace(/\./g, "")
    app
      .database()
      .ref("users")
      .child(newId)
      .set({
        id: props.email,
        name: props.name,
        date: formattedDate,
        time: currentTime,
        entry: currEntry,
      })
      .catch(alert);
    toast("Journal Saved!");
  }

  const submitEntry = async () => {
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
  };

  async function onSubmit(event) {
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
    <>
      <Head>
        <title>Enhanced Journal</title>
      </Head>

      <main className={styles.main}>
        <Link className={styles.journal} href={{pathname: `/posts/entries`, query: {email: props.email}}}>📓</Link>
        {result ? (
          <Title
            level={2}
            className={isModified ? styles.headerModified : styles.headerNormal}
          >
            {result}
          </Title>
        ) : (
          <Title
            level={2}
            className={isModified ? styles.headerModified : styles.headerNormal}
          >
            How are you feeling today?
          </Title>
        )}
        <textarea
          className={styles.focused}
          placeholder="Start typing. Once finished, press Enter to keep the conversation going."
          value={journalEntry}
          onChange={(e) => handleTextareaChange(e)}
          name="journalEntry"
          onKeyDown={handlePressEnter}
        />
        <Button
          className={styles.save}
          onClick={(e) => submitJournal(e)}
        >
          Save Entry
        </Button>
      </main>
    </>
  );
}
