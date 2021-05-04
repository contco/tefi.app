import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import { getLatestBlockHeight } from './api/anchor/lib/utils';

const Home: React.FC = ({ theme, changeTheme }: any) => {
  useEffect(() => {
    getLatestBlockHeight().then((height) => {
      console.log(height);
    });
  }, []);

  return (
    <div>
      <Head>
        <title>Tefi app</title>
      </Head>
      <div>
        <Header theme={theme} changeTheme={changeTheme} />
      </div>
    </div>
  );
};

export default Home;
