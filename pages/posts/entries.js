import Head from "next/head";
import firebase from "../../firebase";
import { useEffect, useState } from "react";
import styles from "../index.module.css"
import Link from "next/link";


export default function Entries() {
  const [entry, setEntry] = useState({});

  useEffect(() => {
    const database = firebase.database();
    let ref = database.ref("journal-entries");

    ref.once("value").then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        setEntry({ date: data.date, entry: data.entry });
        console.log(data);
      });
    });
  }, []);

  return (
    <div>
      <Head>
        <title>Entries</title>
      </Head>
      <main className={styles.main}>
        <h3>Entries</h3>
        <h2>Date: {entry.date}</h2>
        <h2>Entry: </h2>
        <p>{entry.entry}</p>
        <Link href="/"> Back To Home </Link>
      </main>
    </div>
  );
}
