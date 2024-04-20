import { Button, Typography } from "antd";
import firebase from "firebase/app";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-simple-toasts";
import app from "../firebase";
import styles from "./index.module.css";

const { Title, Text } = Typography;

export default function JournalScreen(props) {
  const [journalEntry, setJournalEntry] = useState("");
  const [result, setResult] = useState();
  const [currEntry, setCurrEntry] = useState([]);
  const router = useRouter();
  const email = sessionStorage.getItem("email")
  const name = sessionStorage.getItem("name")

  const today = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);
  const currentTime = today.getTime();

  const handleTextareaChange = (event) => {
    setJournalEntry(event.target.value);
  };

  const handlePressEnter = (event) => {
    if (event.keyCode === 13) {
      // Enter key
      event.preventDefault();
      submitEntry();
    }
  };

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Redirect to home page
        router.push("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  function submitJournal() {
    const newId = email.replace(/\./g, "");
    const session = { date: formattedDate, ts: currentTime, entries: currEntry }
    // const user = {id: email, name: name, sessions: sessions}
    const ref = app
      .database()
      .ref("users")
      .child(newId)
      .child("sessions")

    const newSessionRef = ref.push()
    newSessionRef.set(session)
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

  return (
    <>
      <Head>
        <title>Enhanced Journal</title>
      </Head>

      <main className={styles.main}>

        <Title level={2}>Hi there! It's Jane, your wedding planner. It's a pleasure to meet you! Can you tell me what your budget and theme ideas are for your wedding?</Title>

        <textarea
          className={styles.focused}
          placeholder="Start typing. Once finished, press Enter to keep the conversation going. When you're done, hit `Save Entry`."
          value={journalEntry}
          onChange={(e) => handleTextareaChange(e)}
          name="journalEntry"
          onKeyDown={handlePressEnter}
        />
        <div className={styles.response}>{result}</div>
        <Button className={styles.signOut} onClick={handleSignOut}>
          Sign Out
        </Button>

      </main>
    </>
  );
}
