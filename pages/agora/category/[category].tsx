import Header from '../../../components/Header';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AgoraHomeLayout } from '../../../components/Agora/AgoraHomeLayout';
import { AgoraHomeContent } from '../../../components/Agora/HomeContent';
import { Sidebar } from '../../../components/Agora/Sidebar';
import Loading from '../../../components/Loading';
import { useThreadsByCategory } from '../../../data/useThreadsByCategory';

const AgoraHome: React.FC = ({ theme, changeTheme }: any) => {
  const router = useRouter();
  const category = router?.query?.category as string;
  const [selectedCategory, setCategory] = useState<string | null>(null);
  const { isLoading } = useThreadsByCategory(selectedCategory);

  useEffect(() => {
    if (category) {
      setCategory(category);
    }
  }, [category]);

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
