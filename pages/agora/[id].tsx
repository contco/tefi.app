import Header from '../../components/Header';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Box } from '@contco/core-ui';
import { AgoraHomeLayout } from '../../components/Agora/AgoraHomeLayout';
import { ThreadDetail } from '../../components/Agora/ThreadDetail';
import { Sidebar } from '../../components/Agora/Sidebar';
import { AddReply } from '../../components/Agora/AddReply';
import { Replies } from '../../components/Agora/Replies';
import Loading from '../../components/Loading';
import EmptyComponent from '../../components/EmptyComponent';
import { useThreadById } from '../../data/useThreadById';

const ERROR_MESSAGE = 'Error Fetching Thread!';

const AgoraThread: React.FC = ({ theme, changeTheme }: any) => {
  const selectedCategory = '';
  const router = useRouter();
  const id = router?.query?.id as string;
  const { isLoading, thread, isError } = useThreadById(id);

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
        {isError ? (
          <EmptyComponent msg={ERROR_MESSAGE} height="calc(100vh - 154px)" />
        ) : (
          <Box>
            <ThreadDetail thread={thread} />
            <AddReply threadId={parseInt(id)} />
            <Replies />
          </Box>
        )}
      </AgoraHomeLayout>
    </>
  );
};

export default AgoraThread;
