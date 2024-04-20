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
  // const email = sessionStorage.getItem("email")
  // const name = sessionStorage.getItem("name")

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

  // const handleSignOut = () => {
  //   firebase
  //     .auth()
  //     .signOut()
  //     .then(() => {
  //       // Redirect to home page
  //       router.push("/");
  //     })
  //     .catch((error) => {
  //       console.error("Error signing out:", error);
  //     });
  // };

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
        {/*  */}
      </Head>
     
    <section className={`${styles.chat} ${styles.fullScreen}`}>
      {/* Header */}
      <div className={`${styles['header-chat']}`}>
        <i className={`icon fa fa-user-o`} aria-hidden="true"></i>
        <p className={`${styles.name}`}>Jane the wedding planner</p>
        <i className={`icon clickable fa fa-ellipsis-h ${styles.right}`} aria-hidden="true"></i>
        <Button >
          Sign Out
        </Button>
      </div>
      
      {/* Messages */}
      <div className={`${styles['messages-chat']}`}>
        {/* Message 1 */}
        <div className={`${styles.message}`}>
        <div className={`${styles.photo}`} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aGFwcHklMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D)'}}>
            <div className={`${styles.online}`}></div>
          </div>
          <p className={`${styles.text}`}>Hi there! It's Jane, your wedding planner. It's a pleasure to meet you! Can you tell me what your budget and theme ideas are for your wedding?</p>
        </div>
        {/*middle */}
        <div className={`${styles.message} ${styles['text-only']}`}>
          <div className={`${styles.response}`}>
            <p className={`${styles.text}`}>{journalEntry}</p>
          </div>
        </div>
        {/*  end */}
        <div className={`${styles.message}`}>
        <div className={`${styles.photo}`} style={{backgroundImage: 'url(https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aGFwcHklMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D)'}}>
            <div className={`${styles.online}`}></div>
          </div>
          <p className={`${styles.text}`}>{result}</p>
        </div>
        
       
      </div>
      
      {/* Footer */}
      <div className={`${styles['footer-chat']}`}>
        <i className={`icon fa fa-smile-o clickable`} style={{fontSize: '25pt'}} aria-hidden="true"></i>
        <textarea type="text" className={`${styles['write-message']}`} 
        placeholder="Start typing. Once finished, press Enter to keep the conversation going. When you're done, hit `Save Entry`." 
        value={journalEntry}
        onChange={(e) => handleTextareaChange(e)}
        name="journalEntry"
        onKeyDown={handlePressEnter}/>
       
      </div>
    </section>
    </>
  );
}