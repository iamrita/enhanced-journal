import { Skeleton, Typography } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import firebase from "../../firebase";
import styles from "../index.module.css";

const { Title, Text } = Typography;

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const email = sessionStorage.getItem("email");
    const database = firebase.database();
    let ref = database.ref("users");

    const newEmail = email.replace(/\./g, "");

    ref
      .orderByKey()
      .equalTo(newEmail)
      .on(
        "value",
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val()[newEmail].sessions;
            const localEntries = [];
            for (const key in data) {
              const obj = data[key];
              const date = obj.date;
              const entries = obj.entries;
              localEntries.push({ date: date, entries: entries });
            }
            setEntries(localEntries);
            setIsLoading(false);
          } else {
            console.log(`User with email ${email} does not exist`);
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }, []);

  return (
    <div>
      <Head>
        <title>Entries</title>
      </Head>
      <main className={styles.main}>
        <Title level={3}>Entries</Title>
        {entries.map((entry) => ( // each child should have unique key prop 
          <div>
            <Text>
              <b>Date: </b> {entry.date}
              <br></br>
              <b>Entry: </b> {entry.entries}
            </Text>
          </div>
        ))}
        <Link href={{ pathname: `/journalscreen` }}> Back To Home </Link>
        <Skeleton active loading={isLoading} />
      </main>
    </div>
  );
}
