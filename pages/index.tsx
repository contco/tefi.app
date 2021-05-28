import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Landing from '../components/Landing';

const ADDRESS = `terra15s0q4u4cpvsxgyygm7wy70q9tq0nnr8fg0m1q3`;

import {getTokenBalance} from "./api/mirror/getTokenBalance";

const Home: React.FC = ({ theme, changeTheme }: any) => {

  useEffect(() => {
    async function call () {
      getTokenBalance("terra15s0q4u4cpvsxgyygm7wy70q9tq0nnr8fg0m0q3");
    }
    call();
  })
  return (
    <div>
      <Head>
        <title>Tefi app</title>
      </Head>
      <div>
        <Header theme={theme} changeTheme={changeTheme} address={ADDRESS} />
      </div>
      <Landing />
    </div>
  );
};

export default Home;
