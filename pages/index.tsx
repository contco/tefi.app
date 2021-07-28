import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Landing from '../components/Landing';
import styled from 'styled-components';
import { getPoolsInfo } from './api/terra-core/poolsInfo';

const EmptyContainer = styled.div`
  height: 100vh;
  width: 100vh;
  background-color: ${(props) => props.theme.colors.background};
`;

const Home: React.FC = ({ theme, changeTheme }: any) => {
  const [isDisplay, setIsDisplay] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setIsDisplay(false);
    setTimeout(() => setIsDisplay(true), 1000);
  }, [router.pathname]);

  useEffect(() => {
    getPoolsInfo('terra1q2lyn467rhya0475394djyxqhrfzyqs0tegft3');
  }, [])

  return (
    <div>
      <Head>
        <title>Tefi App</title>
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
