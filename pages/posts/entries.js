import Head from "next/head";
import firebase from "../../firebase";
import { useEffect, useState } from "react";


export default function Entries() {
  const [entry, setEntry] = useState({});

  useEffect(() => {
    const database = firebase.database();
    let ref = database.ref("journalEntry");
  
    ref.on("value", (snapshot) => {
      const data = snapshot.val();
      setEntry({ date: snapshot.val().date, entry: snapshot.val().entry });
      console.log(data);
    });

  }, [])


  return (
    <div>
      <Head>
        <title>Entries</title>
      </Head>
      <h3>Entries</h3>
      <h2>Date: {entry.date}</h2>
      <h2>Entry: </h2>
      <p>{entry.entry}</p>
    </div>
  );
}
