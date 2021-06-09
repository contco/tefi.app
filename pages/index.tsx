import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Landing from '../components/Landing';

import { getAccountData } from './api/mirror/getAccountData';
import { useQuery } from '@apollo/client';
import { GET_ANC_ACCOUNT_DATA } from '../graphql/anc';

const Home: React.FC = ({ theme, changeTheme }: any) => {
  const address = 'terra1sskjgw5e9v7qrqvgalhzc7uh38jslhz4xnjh2a';

  const { loading, error, data } = useQuery(GET_ANC_ACCOUNT_DATA, { variables: { address } });

  if (loading) console.log(loading);
  if (error) console.log(error);
  if (data) console.log(data);

  return (
    <div>
      <Head>
        <title>Tefi app</title>
      </Head>
      <div>
        <Header theme={theme} changeTheme={changeTheme} />
      </div>
      <Landing />
    </div>
  );
};

export default Home;
