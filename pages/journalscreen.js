import { Button, Typography } from "antd";
import firebase from "firebase/app";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-simple-toasts";
import app from "../firebase";
import styles from "./index.module.css";


const { Title, Text } = Typography;

export default function JournalScreen(props) {
  const [journalEntry, setJournalEntry] = useState("");
  const [result, setResult] = useState();
  const [currEntry, setCurrEntry] = useState([]);
  const router = useRouter();
  const [budget, setBudget] = useState("")
  const [location, setLocation] = useState("")
  const [number, setNumber] = useState("")
  const [weddingThemes, setWeddingThemes] = useState("")
  const [picture, setPicture] = useState("")
  const [ecoFriendly, setEcoFriendly] = useState("")
  const [places, setPlaces] = useState([])

  // const email = sessionStorage.getItem("email")
  // const name = sessionStorage.getItem("name")

  const today = new Date();
  const options = { month: "long", day: "numeric", year: "numeric" };
  const formattedDate = today.toLocaleDateString("en-US", options);
  const currentTime = today.getTime();
  const [submittedEntries, setSubmittedEntries] = useState(0)


  const handleTextareaChange = (event) => {

    setBudget(event.target.value);
  };

  const handleEnterBudget = (event) => {
    if (event.keyCode === 13) {
      // Enter key
      event.preventDefault();
      setSubmittedEntries(1)
      // submitEntry();
    }
  };

  const handleEnterLocation = (event) => {
    if (event.keyCode === 13) {
      // Enter key
      event.preventDefault();
      setSubmittedEntries(3)
      // submitEntry();
    }
  };

  const handleEnterNumber = (event) => {
    if (event.keyCode === 13) {
      // Enter key
      event.preventDefault();
      setSubmittedEntries(2)
      // submitEntry();
    }
  };

  const handleEnterTheme = (event) => {
    if (event.keyCode === 13) {
      // Enter key
      event.preventDefault();
      setSubmittedEntries(4)
      // submitEntry();
    }
  };

  const handleEnterEco = (event) => {
    if (event.keyCode === 13) {
      // Enter key
      event.preventDefault();
      submitEntry()
      // submitEntry();
    }
  };

  const handleLocation = (event) => {
    setLocation(event.target.value)
  }

  const handleEco = (event) => {
    setEcoFriendly(event.target.value)
  }

  const handleNumber = (event) => {
    setNumber(event.target.value)
  }

  const handleTheme = (event) => {
    setWeddingThemes(event.target.value)
  }



  function saveEntry(entry, event) {
    if (entry === 1) {
      console.log("1 is here ")
      return handleNumber(event)
    } else if (entry === 2) {
      console.log("2 is here")
      return handleLocation(event)
    } else if (entry === 3) {
      return handleTheme(event)
    } else if (entry === 4) {
      return handleEco(event)
    } else {
      return handleTextareaChange(event)

    }
  }

  function calculateEntry(entry) {
    if (entry === 1) {
      return number
    } else if (entry === 2) {
      return location
    } else if (entry === 3) {
      return weddingThemes
    } else if (entry === 4) {
      return ecoFriendly
    } else {
      return budget
    }
  }

  function submit(entry) {
    if (entry === 1) {
      return handleEnterNumber
    } else if (entry === 2) {
      return handleEnterLocation
    } else if (entry === 3) {
      return handleEnterTheme
    } else if (entry === 4) {
      return handleEnterEco
    } else {
      return handleEnterBudget
    }
  }

  const submitEntry = async () => {
    let text = `Give me three wedding suggestions for under ${budget} dollars in ${location} for ${number} people with the following themes ${weddingThemes}. Number each option`
    try {
      const response = await fetch("/api/generate", {
        // refers to generate.js in the api folder in this project
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ journal: text, theme: weddingThemes, location: location }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setPicture(data.image)
      setPlaces(data.places)
      console.log("amrita hello" + data.places)
      setJournalEntry("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  };


  return (
    <>
      <Head>
        <title>Enhanced Journal</title>
        {/*  */}
      </Head>

      <section className={`${styles.chat} ${styles.fullScreen}`}>
        {/* Header */}
        <div className={`${styles['header-chat']}`}>
          <i className={`icon fa fa - user - o`} aria-hidden="true"></i>
          <p className={`${styles.name}`}>Jane the wedding planner</p>
          <i className={`icon clickable fa fa - ellipsis - h ${styles.right}`} aria-hidden="true"></i>

        </div>

        {/* Messages */}
        <div className={`${styles['messages-chat']}`}>
          {/* Message 1 */}
          <div className={`${styles.message}`}>
            <div className={`${styles.photo}`} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aGFwcHklMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D)' }}>
              <div className={`${styles.online}`}></div>
            </div>
            <p className={`${styles.text}`}>Hi there! It's Jane, your wedding planner. It's a pleasure to meet you! Can you tell me what your budget is for your wedding?</p>
          </div>
          {/*middle */}
          <div className={`${styles.message} ${styles['text-only']}`}>
            <div className={`${styles.response}`}>
              <p className={`${styles.text}`}>{budget}</p>
            </div>
          </div>



          {(submittedEntries === 1 || submittedEntries === 2 || submittedEntries === 3 || submittedEntries === 4) &&

            <div>

              <div className={`${styles.message}`}>
                <div className={`${styles.photo}`} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aGFwcHklMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D)' }}>
                  <div className={`${styles.online}`}></div>
                </div>
                <p className={`${styles.text}`}>How many people do you plan on inviting?</p>
              </div>
              <div className={`${styles.message} ${styles['text-only']}`}>
                <div className={`${styles.response}`}>
                  <p className={`${styles.text}`}>{number}</p>
                </div>
              </div>



            </div>

          }

          {(submittedEntries === 2) &&

            <div>

              <div className={`${styles.message}`}>
                <div className={`${styles.photo}`} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aGFwcHklMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D)' }}>
                  <div className={`${styles.online}`}></div>
                </div>
                <p className={`${styles.text}`}>Where are you located?</p>
              </div>
              <div className={`${styles.message} ${styles['text-only']}`}>
                <div className={`${styles.response}`}>
                  <p className={`${styles.text}`}>{location}</p>
                </div>
              </div>

            </div>

          }


          {(submittedEntries === 3) &&

            <div>

              <div className={`${styles.message}`}>
                <div className={`${styles.photo}`} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aGFwcHklMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D)' }}>
                  <div className={`${styles.online}`}></div>
                </div>
                <p className={`${styles.text}`}>What themes are you feeling?</p>
              </div>
              <div className={`${styles.message} ${styles['text-only']}`}>
                <div className={`${styles.response}`}>
                  <p className={`${styles.text}`}>{weddingThemes}</p>
                </div>
              </div>

            </div>

          }

          {(submittedEntries === 4) &&

            <div>

              <div className={`${styles.message}`}>
                <div className={`${styles.photo}`} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aGFwcHklMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D)' }}>
                  <div className={`${styles.online}`}></div>
                </div>
                <p className={`${styles.text}`}>Would you like to make your wedding eco-friendly - highly recommended!</p>
              </div>
              <div className={`${styles.message} ${styles['text-only']}`}>
                <div className={`${styles.response}`}>
                  <p className={`${styles.text}`}>{ecoFriendly}</p>
                </div>
              </div>

            </div>

          }

          {/*  end */}
          <div className={`${styles.message}`}>
            <div className={`${styles.photo}`} style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aGFwcHklMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D)' }}>
              <div className={`${styles.online}`}></div>
            </div>
            <p className={`${styles.text}`}>{result}</p>
          </div>



        </div>

        {/* Footer */}
        {!result &&
          <div className={`${styles['footer-chat']}`}>
            <i className={`icon fa fa - smile - o clickable`} style={{ fontSize: '25pt' }} aria-hidden="true"></i>
            <textarea type="text" className={`${styles['write-message']}`}
              placeholder="Start typing. Once finished, press Enter to keep the conversation going. "
              value={calculateEntry(submittedEntries)}
              onChange={(e) => saveEntry(submittedEntries, e)}
              name="number"
              onKeyDown={submit(submittedEntries)} />
          </div>}
      </section>

      {picture.length > 0 ? (
        <img className="result-image" src={picture} alt="result" />
      ) : (
        <></>
      )}
      <div>Women-Owned Wedding Businesses in your area
        <div>{places[0].name}</div>
        <div>{places[1].name}</div>

        <div>{places[2].name}</div>

        <div>{places[3].name}</div>

        <div>{places[4].name}</div>

        <div>{places[5].name}</div>

        <div>{places[6].name}</div>

        <div>{places[7].name}</div>
        <div>{places[8].name}</div>

        <div>{places[9].name}</div>
      </div>
    </>
  );
}