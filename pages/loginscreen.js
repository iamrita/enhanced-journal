import Head from "next/head";
import app from "../firebase";
import { useState } from "react";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { EmailContext } from "../EmailContext";

import firebase from "firebase/app";
import JournalScreen from "./journalscreen";

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
        // set session storage here
        sessionStorage.setItem("email", user.email);
        sessionStorage.setItem("name", user.displayName);
        router.push("/journalscreen")
      });
  };

    // Render the login screen if email is not set yet
    return (
      <div className={styles.signin}>
        <div>
          <p className={styles.journalIcon}>🌹</p>
          <p>
            Say hello to your Jane &mdash; <br />
            <b>your wedding planner.</b>
          </p>
        </div>
        <button className={styles.centerButton} onClick={signInWithGoogle}>
          Sign In With Google
        </button>
      </div>
    );
  
}
