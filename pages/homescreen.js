import Head from "next/head";
import app from "../firebase";
import { useState } from "react";
import { Button } from "antd";
import App from "./app";

import firebase from "firebase/app";

export default function HomeScreen() {
  const [email, setEmail] = useState();

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
        var user = result.user;
        console.log(user);

        setEmail(user.email);
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
      <Head>Home Page</Head>
      {email ? (
        <App />
      ) : (
        <Button onClick={signInWithGoogle}>Sign In With Google</Button>
      )}
    </>
  );
}
