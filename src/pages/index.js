import Head from "next/head";
import { useState } from "react";
import styles from "../styles/index.module.css";
import React from "react";
import parse from "html-react-parser"


const Home = () => {
  const [wordInput, setWordInput] = useState("");
  const [result, setResult] = useState();



  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: wordInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setWordInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
      <div>
        <Head>
          <title>s22020 API</title>
        </Head>

        <main className={styles.main}>
          <h3 className={styles.h3}>API</h3>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="word"
              placeholder="Enter an text"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
            />
            <input type="submit" value="Generate text" />
          </form>
          <div className={styles.glasscontainer} id="glass">
            <a className={styles.result}>
              {parse("" + result)}
            </a>
          </div>

        </main>
      </div>
  );
}

export default Home