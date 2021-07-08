import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Landing from '../components/Landing';
import styled from 'styled-components';
import {getGatewayData} from "./api/pylon/getGatewayData";
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
    async function ab() {
   const result =  await getGatewayData("terra18jg24fpqvjntm2wfc0p47skqccdr9ldtgl5ac9");
    console.log(result[0]);
  }
  ab();
  }, [])
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
