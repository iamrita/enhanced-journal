import { Skeleton, Typography } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import firebase from "../../firebase";
import styles from "../index.module.css";
import Image from "next/image";
import isEmpty from "lodash/isEmpty";

const { Title, Text } = Typography;

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currEntry, setCurrEntry] = useState({});

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

  const nextDateEntry = () => {
    const index = entries.indexOf(currEntry);
    if (index === entries.length - 1) {
      return;
    }
    setCurrEntry(entries[index + 1]);
  };

  const prevDateEntry = () => {
    const index = entries.indexOf(currEntry);
    if (index === 0) {
      return;
    }
    setCurrEntry(entries[index - 1]);
  };

  useEffect(() => {
    setCurrEntry(entries[0]);
  }, [entries]);

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div
            className={styles.dateArrow}
            onClick={prevDateEntry}
            role="button"
            tabIndex="0"
            aria-label="Previous Date"
          >
            <Image
              src="/backwardArrow.svg"
              width="17"
              height="12"
              alt="Next Date Button"
            />
          </div>
          <div className={styles.headerDateContainer}>
            <div className={styles.headerDateContent}>
              {!isEmpty(currEntry) && (
                <>
                  <div className={styles.headerDate}>{currEntry?.date}</div>
                  <div className={styles.headerEntry}>
                    Entry #{entries.indexOf(currEntry) + 1}
                  </div>
                </>
              )}
            </div>
          </div>
          <div
            className={styles.dateArrow}
            onClick={nextDateEntry}
            role="button"
            tabIndex="0"
            aria-label="Next Date"
          >
            <Image
              src="/forwardArrow.svg"
              width="17"
              height="12"
              alt="Past Date Button"
            />
          </div>
        </div>
      </header>
      ;
      <div className={styles.sidebar}>
        <div className={styles.homeLogo}>
          <Link href={{ pathname: `/journalscreen` }} className={styles.logo}>
            📓
          </Link>
        </div>
        <div className={styles.sidebarContent}>
          <div className={styles.addEntryPlus}>
            <Image
              src="/plus.svg"
              width="12"
              height="12"
              alt="Add Entry Button"
            />
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
