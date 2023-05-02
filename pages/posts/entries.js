import { Skeleton, Typography } from 'antd';
import Head from "next/head";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from "react";
import firebase from "../../firebase";
import styles from "../index.module.css";
import { EmailContext } from '../../EmailContext';

const { Title, Text } = Typography;

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const emailContext = useContext(EmailContext)
  console.log("emailContext in entries is"+ emailContext)

  useEffect(() => {
    const database = firebase.database();
    let ref = database.ref("users");

    if (!emailContext) {
      return
    }

    const newEmail = emailContext.replace(/\./g, "")

    ref.orderByKey().equalTo(newEmail).on('value', (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()[newEmail].entry
        setEntries(data)
        setIsLoading(false)
        console.log(snapshot.val()[newEmail].entry);
      } else {
        console.log(`User with email ${emailContext} does not exist`);
      }
    }, (error) => {
      console.error(error);
    });

    //  // const childValues = Object.values(data);
    //  // const sortedData = childValues.sort((a,b) => b.time - a.time) // sort data by time
    //  // setEntries(sortedData);
    //   setIsLoading(false);
    // });

  }, []);

  return (
    <div>
      <Head>
        <title>Entries</title>
      </Head>
      <main className={styles.main}>
        <Title level={3}>Entries</Title>
        <p>Email: {emailContext}</p>
        <Link href={{pathname: `/journalscreen`}}> Back To Home </Link> {/*not able to make new entries after going back, need to store email across pages*/}
        {entries.map((entry) => (
          <div>
            <Text>
              <b>Entry:</b> {entry}
            </Text>
          </div>
        ))}
        <Skeleton active loading={isLoading}/> 
      </main>
    </div>
  );
}
