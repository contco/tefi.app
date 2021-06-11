import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Landing from '../components/Landing';

import {getAccountData} from "./api/mirror/getAccountData"

const Home: React.FC = ({ theme, changeTheme }: any) => {

  getAccountData("terra15s0q4u4cpvsxgyygm7wy70q9tq0nnr8fg0m0q3")
  return (
    <div>
      <Head>
        <title>Tefi app</title>
      </Head>
      <div>
        <Header theme={theme} changeTheme={changeTheme} />
      </div>
      <Landing />
    </div>
  );
};

export default Home;
