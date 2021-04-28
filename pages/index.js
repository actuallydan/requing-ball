import { useState } from "react";

import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { fastFetch } from "../lib/fastFetch";
import SpringSpinner from '@bit/bondz.react-epic-spinners.spring-spinner';

const defaultObj = `{
  "method": "GET",
  "url": "https://randomuser.me/api/?results=5",
  "Headers": {
      "Access-Allow-Origin": "*"
  }
}`;

export default function Home() {
  const [request, setRequest] = useState(defaultObj);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(null);
  const [result, setResult] = useState("Your result will appear here!");
  const [loading, setLoading] = useState(false);

  const changeText = (e) => {
    setError(null);
    setRequest(e.target.value);
  }

  const resetState = () => {
    setTime(null);
    setResult(null);
    setError(null);
  }

  const sendRequest = async () => {
    resetState();
    setLoading(true);

    try {
      const obj = JSON.parse(request.trim());
      if (!obj.url) {
        throw 'Request must have a url property'
      }

      let t0 = performance.now();
      let res = await fastFetch(obj, 60000);
      const time = performance.now() - t0;

      setTime(time);
      setResult(JSON.stringify(res, null, 2));

    } catch (e) {
      console.error(e);
      if (e?.message.includes('Unexpected token')) {
        setError(e.message + ". \nMake sure your request is valid JSON (use double-quotes!)");
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const isFast = time && time < 100;

  return (
    <div className={styles.container}>
      <Head>
        <title>Requing Ball</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Requing Ball Request Cache
        </h1>

        <p className={styles.description}>
          Get started by entering a {' '}
          <code className={styles.code}>fetch</code> request object.
        </p>

        <textarea className={styles.code + " " + styles.textarea} onChange={changeText} value={request}>
        </textarea>
        <button role="button" className={styles.button} onClick={sendRequest}>{
          loading
            ? <SpringSpinner
              color='#FFFFFF'
              size='25'
            />
            : "Go"
        }
        </button>
        {error && <p className={styles.red}>{error}</p>}

        {time && (<p className={styles.description}>
          Results in {' '}
          <code className={`${styles.code} ${isFast ? styles.green : styles.red}`}>{time}</code> ms{isFast ? "!" : "."}
        </p>)}
        <textarea contentEditable={false} className={styles.code + " " + styles.textarea} onChange={changeText} value={result}>
        </textarea>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
