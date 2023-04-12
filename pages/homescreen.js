import Head from "next/head";
import app from "../firebase";
import { useState } from "react";
import { Button } from "antd";
import App from "./app";
import styles from "./index.module.css";

import firebase from "firebase/app";

export default function HomeScreen() {
  const [email, setEmail] = useState();
  const [name, setName] = useState()
  var user

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
        console.log(user);

        setEmail(user.email);
        setName(user.displayName)
      });
  };

  function signOut() {
    firebase
      .auth()
      .signOut()
      .then(function (result) {
        setEmail(false);
        console.log(result);
      });
  }

  return (
    <>
      {email ? (
        <App myProp={name}/> // pass in the user as props here 
      ) : (
        <div className={styles.signin}>
          <Button className={styles.centerButton} onClick={signInWithGoogle}>
            Sign In With Google
          </Button>
        </div>
      )}
    </>
  );
}
