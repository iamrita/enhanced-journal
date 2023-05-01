import Head from "next/head";
import firebase from "../../firebase";
import { useEffect, useState } from "react";
import styles from "../index.module.css";
import Link from "next/link";
import { Typography, Skeleton } from 'antd';
import { useRouter } from 'next/router';

const { Title, Text } = Typography;

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { email } = router.query;

  useEffect(() => {
    const database = firebase.database();
    let ref = database.ref("users");

    const newEmail = email.replace(/\./g, "")

    ref.orderByKey().equalTo(newEmail).on('value', (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()[newEmail].entry
        setEntries(data)
        setIsLoading(false)
        console.log(snapshot.val()[newEmail].entry);
      } else {
        console.log(`User with email ${email} does not exist`);
      }
    }, (error) => {
      console.error(error);
    });

    // ref.on("value", (snapshot) => {
    //   const data = snapshot.val();
    //   console.log(data)
    //   const newEmail = email.replace(/\./g, "")
    //   // look for the logged in user's email in the database, get the entries from there 


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
        <p>Email: {email}</p>
        <Link href="/"> Back To Home </Link>
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
