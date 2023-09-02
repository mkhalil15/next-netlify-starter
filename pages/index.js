import React, { useState, useEffect } from "react";
import axios from "axios";

import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'

export default function Home() {
  const [month, setMonth] = useState("");
  let fetchMonth = React.useCallback(async () => {
    const response = await axios.get("https://mkhalil.pythonanywhere.com");
    console.log(response.data);
  },[])

  useEffect(() => {
    fetchMonth();
  }, [fetchMonth])

  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Welcome to my app!" />
        <p className="description">
          Get started by editing <code>pages/index.js</code>
        </p>
      </main>

      <Footer />
    </div>
  )
}
