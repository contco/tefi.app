import Header from '../../components/Header';
import Head from 'next/head';
import React, { useState } from 'react';
import { AgoraHomeLayout } from '../../components/Agora/AgoraHomeLayout';
import { AgoraHomeContent } from '../../components/Agora/HomeContent';
import { Sidebar } from '../../components/Agora/Sidebar';
import Loading from '../../components/Loading';
import { useThreadsByCategory } from '../../data/useThreadsByCategory';

const DEFAULT_CATEGORY = 'General';

const AgoraHome: React.FC = ({ theme, changeTheme }: any) => {
  const [selectedCategory, setCategory] = useState<string>(DEFAULT_CATEGORY);
  const { isLoading } = useThreadsByCategory(selectedCategory);

  if (isLoading) {
    return <Loading height="100vh" currentTheme={theme} />;
  }

  return (
    <>
      <Head>
        <title>TeFi Agora</title>
      </Head>
      <Header theme={theme} changeTheme={changeTheme} logoSub="DAO" />
      <AgoraHomeLayout>
        <Sidebar selectedCategory={selectedCategory} />
        <AgoraHomeContent selectedCategory={selectedCategory} setCategory={setCategory} />
      </AgoraHomeLayout>
    </>
  );
};

export default AgoraHome;
