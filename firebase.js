import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCCMlgSvtjiMCTUlWJ6AWSUR-19ooaX3Is",
  authDomain: "enhanced-journal.firebaseapp.com",
  projectId: "enhanced-journal",
  storageBucket: "enhanced-journal.appspot.com",
  messagingSenderId: "792408136494",
  appId: "1:792408136494:web:9504445385c30b50f2b8bf",
  measurementId: "G-DWS6Q104HV",
};

// need to do this otherwise firebase will initialize multiple times 
export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

