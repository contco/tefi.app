import Header from '../../components/Header';
import Head from 'next/head';
import React, { useState } from 'react';
import { AgoraHomeLayout } from '../../components/Agora/AgoraHomeLayout';
import { AgoraHomeContent } from '../../components/Agora/HomeContent';
import { Sidebar } from '../../components/Agora/Sidebar';

const AgoraHome: React.FC = ({ theme, changeTheme }: any) => {
  const [selectedCategory, setCategory] = useState<string>('General');
  return (
    <>
      <Head>
        <title>TeFi Agora</title>
      </Head>
      <Header theme={theme} changeTheme={changeTheme} logoSub="DAO" />
      <AgoraHomeLayout>
        <Sidebar selectedCategory={selectedCategory} setCategory={setCategory} />
        <AgoraHomeContent selectedCategory={selectedCategory} setCategory={setCategory} />
      </AgoraHomeLayout>
    </>
  );
};

export default AgoraHome;
