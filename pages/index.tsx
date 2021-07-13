import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Landing from '../components/Landing';
import styled from 'styled-components';
import { getAccount } from './api/anchor/lib/anc';
const EmptyContainer = styled.div`
  height: 100vh;
  width: 100vh;
  background-color: ${(props) => props.theme.colors.primary};
`;

const Home: React.FC = ({ theme, changeTheme }: any) => {
  const [isDisplay, setIsDisplay] = useState<boolean>(false);
  const router = useRouter();
  
  useEffect(() => {
    setIsDisplay(false);
    setTimeout(() => setIsDisplay(true), 1000);
  }, [router.pathname]);

  useEffect(() => {
    getAccount("terra1a4xyusa48u9cx678cvx23jajh4ca6v8ec2pguu");
  });
  return (
    <div>
      <Head>
        <title>Tefi app</title>
      </Head>
      {!isDisplay ? (
        <EmptyContainer />
      ) : (
        <div>
          <div>
            <Header theme={theme} changeTheme={changeTheme} />
          </div>
          <Landing />
        </div>
      )}
    </div>
  );
};

export default Home;
