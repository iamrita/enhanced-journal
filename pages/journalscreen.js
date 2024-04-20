import { Button, Typography, theme } from "antd";
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
  const [budget, setBudget] = useState("")
  const [location, setLocation] = useState("")
  const [number, setNumber] = useState("")
  const [weddingThemes, setWeddingThemes] = useState("")
  const router = useRouter();
  const email = sessionStorage.getItem("email")
  const name = sessionStorage.getItem("name")
  const [picture, setPicture] = useState("")

  const today = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);
  const currentTime = today.getTime();

  const handleTextareaChange = (event) => {
    setJournalEntry(event.target.value);
  };

  const handleBudget = (event) => {
    setBudget(event.target.value)
  }

  const handleLocation = (event) => {
    setLocation(event.target.value)
  }

  const handleNumber = (event) => {
    setNumber(event.target.value)
  }

  const handleTheme = (event) => {
    setWeddingThemes(event.target.value)
  }


  const handlePressEnter = (event) => {
    submitEntry();

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

  function optionOne(text) {
    console.log("amrita " + text)
    let firstPeriod = text.indexOf("1")
    let firstOption = text.substring(firstPeriod, text.indexOf("2"))
    let secondOption = text.substring(text.indexOf("2"), text.indexOf("3"))
    let thirdOption = text.substring(text.indexOf("3"))
    return firstOption
  }

  function optionTwo(text) {
    let secondOption = text.substring(text.indexOf("2"), text.indexOf("3"))

    return secondOption
  }

  function optionThree(text) {
    let thirdOption = text.substring(text.indexOf("3"))
    return thirdOption
  }
  const submitEntry = async () => {
    // currEntry.push(journalEntry);
    let text = `Give me three wedding suggestions for under ${budget} dollars in ${location} for ${number} people with the following themes:
    ${weddingThemes}. Number each option`
    try {
      const response = await fetch("/api/generate", {
        // refers to generate.js in the api folder in this project
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ journal: text, theme: weddingThemes }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setResult(data.result)
      setPicture(data.image)
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

        <Title level={2}>Hi there! It's Jane, your wedding planner. It's a pleasure to meet you! Let's get to know each other.</Title>

        {/* <textarea
          className={styles.focused}
          placeholder="Start typing. Once finished, press Enter to keep the conversation going. When you're done, hit `Save Entry`."
          value={journalEntry}
          onChange={(e) => handleTextareaChange(e)}
          name="journalEntry"
          onKeyDown={handlePressEnter}
        /> */}
        <Title level={2}>What is your budget for this wedding?</Title>

        <textarea
          className={styles.focused}
          value={budget}
          onChange={(e) => handleBudget(e)}
        />

        <Title level={2}>How many people do you expect coming?</Title>

        <textarea
          className={styles.focused}
          value={number}
          onChange={(e) => handleNumber(e)}
        />

        <Title level={2}>Where are you located?</Title>

        <textarea
          className={styles.focused}
          value={location}
          onChange={(e) => handleLocation(e)}
        />


        <Title level={2}>What general themes are you aiming for?</Title>

        <textarea
          className={styles.focused}
          value={weddingThemes}
          onChange={(e) => handleTheme(e)}
        />

        <Button className={styles.signOut} onClick={handlePressEnter}>Plan my wedding!</Button>
        {picture.length > 0 ? (
          <img className="result-image" src={picture} alt="result" />
        ) : (
          <></>
        )}

        {result && <div className={styles.response}>
          <ol>{optionOne(result)}</ol>
          <ol>{optionTwo(result)}</ol>
          <ol>{optionThree(result)}</ol></div>}
        <Button className={styles.signOut} onClick={handleSignOut}>
          Sign Out
        </Button>

      </main>
    </>
  );
}
