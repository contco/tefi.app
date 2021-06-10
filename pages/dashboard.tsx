import React from 'react';
import Head from 'next/head';
import css from '@styled-system/css';
import Styled from 'styled-components';
import { Box } from '@contco/core-ui';
import Header from '../components/Header';
import Assets from '../components/Asset';
import MarketValue from '../components/MarketValue';
import Borrowing from '../components/Borrowing';
import Pools from '../components/Pools';
import Rewards from '../components/Rewards';
import { useQuery } from '@apollo/client';
import { GET_ANC_ACCOUNT_DATA } from '../graphql/anc';

const Body = Styled(Box)`
${css({
  m: 'auto',
  width: ['90%', null, '75%'],
  mt: 20,
})}
`;
const ADDRESS = `terra15s0q4u4cpvsxgyygm7wy70q9tq0nnr8fg0m0q3`;

const Dashboard: React.FC = ({ theme, changeTheme }: any) => {
  const { loading, error, data } = useQuery(GET_ANC_ACCOUNT_DATA, { variables: { address: ADDRESS } });

  if (loading) return <p>Loading</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <Head>
        <title>Tefi App | Dashboard</title>
      </Head>
      <div>
        <Header theme={theme} changeTheme={changeTheme} address={ADDRESS} />
        <Body>
          <MarketValue />
          <Assets ancAssets={data?.assets?.anchor} />
          <Borrowing ancAssets={data?.assets?.anchor} />
          <Rewards ancAssets={data?.assets?.anchor} />
          <Pools ancAssets={data?.assets?.anchor} />
        </Body>
      </div>
    </div>
  );
};

export default Dashboard;
