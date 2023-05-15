import { Skeleton, Typography } from "antd";
import Head from "next/head";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import firebase from "../../firebase";
import styles from "../index.module.css";

const { Title, Text } = Typography;

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currEntry, setCurrEntry] = useState([]);

  const getDateRepresentation = (entry) => {
    const date = new Date(entry.date);
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    return months[date.getMonth()];
  };

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
            const groupedObj = localEntries.reduce((acc, entry) => {
              const date = entry.date;
              if (!acc[date]) {
                acc[date] = { date: date, entries: [] };
              }
              acc[date].entries.push(entry.entries);
              return acc;
            }, {});

            const result = Object.keys(groupedObj).map(
              (date) => groupedObj[date]
            );

            setEntries(result);
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

  useEffect(() => {
    setCurrEntry(entries[0]);
  }, [entries]);

  return (
    <div>
      <header className={styles.header}></header>;
      <div className={styles.sidebar}>
        <div className={styles.homeLogo}>
          <Link href={{ pathname: `/journalscreen` }} className={styles.logo}>
            📓
          </Link>
        </div>
        <div className={styles.sidebarContent}>
          <div className={styles.addEntryPlus}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.99935 11.8332C5.76324 11.8332 5.55838 11.7464 5.38477 11.5728C5.21115 11.3991 5.12435 11.1965 5.12435 10.9647V6.87484H1.03449C0.802731 6.87484 0.600043 6.78803 0.426432 6.61442C0.252821 6.44081 0.166016 6.23595 0.166016 5.99984C0.166016 5.76373 0.252821 5.55887 0.426432 5.38525C0.600043 5.21164 0.802731 5.12484 1.03449 5.12484H5.12435V1.03498C5.12435 0.803219 5.21115 0.600532 5.38477 0.426921C5.55838 0.253309 5.76324 0.166504 5.99935 0.166504C6.23546 0.166504 6.44032 0.253309 6.61393 0.426921C6.78754 0.600532 6.87435 0.803219 6.87435 1.03498V5.12484H10.9642C11.196 5.12484 11.3987 5.21164 11.5723 5.38525C11.7459 5.55887 11.8327 5.76373 11.8327 5.99984C11.8327 6.23595 11.7459 6.44081 11.5723 6.61442C11.3987 6.78803 11.196 6.87484 10.9642 6.87484H6.87435V10.9647C6.87435 11.1965 6.78754 11.3991 6.61393 11.5728C6.44032 11.7464 6.23546 11.8332 5.99935 11.8332Z"
                fill="#232323"
              />
            </svg>
          </div>
          {entries.map((entry) => {
            return (
              <div
                className={`${styles.dateBoxes} ${
                  currEntry == entry ? styles.active : ""
                }`}
                onClick={() => {
                  setCurrEntry(entry);
                }}
              >
                <div className={styles.month}>
                  {getDateRepresentation(entry)}
                </div>
                <div className={styles.date}>
                  {new Date(entry.date).getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <main className={styles.main}>
        <Title level={3}>Entries</Title>
        {entries.map((entry) => {
          const date = entry.date;
          if (date === currEntry?.date) {
            return entry.entries.map((e) => {
              return (
                <div>
                  <Text>
                    <b>Date: </b> {date}
                    <br></br>
                    <b>Entry: </b> {e}
                  </Text>
                </div>
              );
            });
          }
        })}
        <Link href={{ pathname: `/journalscreen` }}> Back To Home </Link>
        <Skeleton active loading={isLoading} />
      </main>
    </div>
  );
}
