import Head from "next/head";
import firebase from "../../firebase";
import { useEffect, useState } from "react";
import styles from "../index.module.css";
import Link from "next/link";

export default function Entries() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const database = firebase.database();
    let ref = database.ref("journal-entries");

    ref.on("value", (snapshot) => {
      const data = snapshot.val();
      const childValues = Object.values(data);
      setEntries(childValues);
      console.log(childValues);
    });
  }, []);

  return (
    <div>
      <Head>
        <title>Entries</title>
      </Head>
      <main className={styles.main}>
        <h3>Entries</h3>
        {entries.reverse().map((entry) => (
          <div>
            <h2>Date: {entry.date}</h2>
            <p><b>Entry:</b> {entry.entry}</p>
          </div>
        ))}

        <Link href="/"> Back To Home </Link>
      </main>
    </div>
  );
}
