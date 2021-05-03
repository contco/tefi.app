import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';

const ADDRESS = `terra15s0q4u4cpvsxgyygm7wy70q9tq0nnr8fg0m1q3`

const Home: React.FC = ({ theme, changeTheme }: any) => {
  return (
    <div>
      <Head>
        <title>Tefi app</title>
      </Head>
      <div>
        <Header theme={theme} changeTheme={changeTheme} address={ADDRESS} />
      </div>
    </div>
  );
};


export default Home;
