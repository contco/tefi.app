import Header from '../../components/Header';
import Head from 'next/head';
import React, { useState } from 'react';
import { AgoraHomeLayout } from '../../components/Agora/AgoraHomeLayout';
import { ThreadDetail } from '../../components/Agora/ThreadDetail';
import { Sidebar } from '../../components/Agora/Sidebar';

const AgoraThread: React.FC = ({ theme, changeTheme }: any) => {
  const [selectedCategory, setCategory] = useState<string>('');
  return (
    <>
      <Head>
        <title>TeFi Agora</title>
      </Head>
      <Header theme={theme} changeTheme={changeTheme} logoSub="DAO" />
      <AgoraHomeLayout>
        <Sidebar selectedCategory={selectedCategory} setCategory={setCategory} />
        <ThreadDetail />
      </AgoraHomeLayout>
    </>
  );
};

export default AgoraThread;
