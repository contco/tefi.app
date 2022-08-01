import Header from '../../components/Header';
import Head from 'next/head';
import React from 'react';
import { SubHeader } from '../../components/Agora/SubHeader';

const DAO: React.FC = ({ theme, changeTheme }: any) => {
  return (
    <>
      <Head>
        <title>TeFi Agora</title>
      </Head>
      <Header theme={theme} changeTheme={changeTheme} logoSub="DAO" />
      <SubHeader />
    </>
  );
};

export default DAO;
