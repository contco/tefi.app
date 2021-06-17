import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Landing from '../components/Landing';
import styled from 'styled-components';
import { DEFAULT_MANTLE_ENDPOINTS } from '../utils/ancEndpoints';
import { rewardsClaimableAncUstLpRewardsQuery } from './api/anchor/lib/lp';

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
    const call = async () => {
      const result = await rewardsClaimableAncUstLpRewardsQuery(
        DEFAULT_MANTLE_ENDPOINTS['mainnet'],
        'terra1sskjgw5e9v7qrqvgalhzc7uh38jslhz4xnjh2a',
      );

      console.log(result);
    };
    call();
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
