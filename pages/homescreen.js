import Head from "next/head";
import app from "../firebase";
import { useState } from "react";
import { Button } from "antd";
import App from "./app";
import styles from "./index.module.css";
import Typewriter from "typewriter-effect";
import { useSpring, a } from "@react-spring/web";
import animStyles from "./animation.module.css"

import firebase from "firebase/app";

export default function HomeScreen() {
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  var user;

  const [flipped, set] = useState(false);
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

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
        setName(user.displayName);
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
        <App name={name} email={email}/> // pass in the user as props here
      ) : (
        <div className={styles.signin}>
          {/* <Typewriter
            className={styles.typeWriter}
            onInit={(typewriter) => {
              typewriter
                .typeString("your daily journal.")
                .callFunction(() => {
                  console.log("String typed out!");
                })
                .pauseFor(2500)
                .deleteAll()
                .typeString("start writing.")
                .start();
            }}
          /> */}
          <div>
           <p>Say hello to your new best friend &mdash; <br/><b>your journal.</b></p>
          </div>
          <button className={styles.centerButton} onClick={signInWithGoogle}>
            Sign In With Google
          </button>
        </div>
      )}
    </>
  );
}
