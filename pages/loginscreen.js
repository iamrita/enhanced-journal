import Head from "next/head";
import app from "../firebase";
import { useState } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";

import firebase from "firebase/app";

export default function LoginScreen() {
  var user;
  const router = useRouter();

  const signInWithGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        user = result.user;
        router.push({
          pathname: "/journalscreen",
          query: { nameProps: user.displayName, emailProps: user.email },
        });
      });
  
  };

  return (
    <>
      <div className={styles.signin}>
        <div>
          <p className={styles.journalIcon}>📓</p>
          <p>
            Say hello to your new best friend &mdash; <br />
            <b>your journal.</b>
          </p>
        </div>
        <button className={styles.centerButton} onClick={signInWithGoogle}>
          Sign In With Google
        </button>
      </div>
    </>
  );
}
