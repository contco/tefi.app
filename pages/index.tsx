import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Landing from '../components/Landing';
import styled from 'styled-components';
import { TEFI_PREVIEW_IMAGE } from '../constants';

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

  return (
    <div>
        <Head>
        <title>Tefi App</title>
        <link rel="icon" href="/favicon.ico?v=2" />
        <meta property="og:url" content="https://www.tefi.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={'Tefi App'} />
        <meta name="twitter:card" content="TefiApp | Your portal to TeFi" />
        <meta
          property="og:description"
          content="TefiApp | Your portal to TeFi"
        />
        <meta property="og:image" content={TEFI_PREVIEW_IMAGE} />
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
