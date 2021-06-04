import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Landing from '../components/Landing';


import {getAssetsStats} from "./api/mirror/getAssetsStats";


const Home: React.FC = ({ theme, changeTheme }: any) => {

  useEffect(() => {
    async function call () {
      getAssetsStats();
    }
    call();
  })
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
