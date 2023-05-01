import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import app from "../firebase";
import Link from "next/link";
import toast from "react-simple-toasts";
import firebase from "firebase/app";
import { Button, Typography, Form, Input } from "antd";

const { Title, Text } = Typography;

export default function App(props) {
  const [journalEntry, setJournalEntry] = useState("");
  const [result, setResult] = useState();
  const [currEntry, setCurrEntry] = useState([]);
  const [email, setEmail] = useState()

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
  };

  function signOut() {
    firebase
      .auth()
      .signOut()
      .then(function (result) {
        setEmail(false)
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
        <Link href={`/posts/entries`}>Journal</Link>
        <Title level={3}>Today is {formattedDate}.</Title>
        <h1>Hello {props.name}!</h1>
        {result ? (
          <Title level={2} className={styles.result}>
            {result}
          </Title>
        ) : (
          <Title level={2} className={styles.result}>
            How are you feeling today?
          </Title>
        )}
        <Form onFinish={onSubmit}>
          <Form.Item>
            <Input.TextArea
              className={styles.textarea}
              placeholder="Start typing..."
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              name="journalEntry"
              onPressEnter={onSubmit}
            />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" className={styles.submit}>
              Submit Entry
            </Button>
          </Form.Item>
        </Form>

        <br></br>
        <Title level={2}>My Current Entry: </Title>

        {currEntry.map((entry, i) => (
          <div key={i}>
            <Text>{entry}</Text>
          </div>
        ))}

        <Button
          type="primary"
          size="large"
          className={styles.save}
          onClick={(e) => submitJournal(e)}
        >
          Save Entry
        </Button>
        <Button onClick={signOut}>Sign Out</Button>
      </main>
    </>
  );
}
