import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';


const Home: React.FC = ({ theme, changeTheme }: any) => {
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
