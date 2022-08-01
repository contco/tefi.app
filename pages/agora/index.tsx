import Header from '../../components/Header';
import Head from 'next/head';
import React from 'react';
import { SubHeader } from '../../components/Agora/SubHeader';
import { Threads } from '../../components/Agora/Threads';

const DAO: React.FC = ({ theme, changeTheme }: any) => {
  return (
    <>
      <Head>
        <title>TeFi Agora</title>
      </Head>
      <Header theme={theme} changeTheme={changeTheme} logoSub="DAO" />
      <SubHeader />
      <Threads />
    </>
  );
};

export default DAO;
