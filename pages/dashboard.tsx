import React, { useEffect } from 'react';
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

import { getLpAPY } from './api/anchor/lib/lp';
import { getGovAPY } from './api/anchor/lib/gov';
import { getBorrowAPY } from './api/anchor/lib/borrow';

const Body = Styled(Box)`
${css({
  m: 'auto',
  width: ['90%', null, '75%'],
  mt: 20,
})}
`;
const ADDRESS = `terra15s0q4u4cpvsxgyygm7wy70q9tq0nnr8fg0m1q3`;

const Dashboard: React.FC = ({ theme, changeTheme }: any) => {
  useEffect(() => {
    const getRewards = async () => {
      const result = await getBorrowAPY();
      console.log(result);
    };
    getRewards();
  }, []);

  return (
    <div>
      <Head>
        <title>Tefi App | Dashboard</title>
      </Head>
      <div>
        <Header theme={theme} changeTheme={changeTheme} address={ADDRESS} />
        <Body>
          <MarketValue />
          <Assets />
          <Borrowing />
          <Rewards />
          <Pools />
        </Body>
      </div>
    </div>
  );
};

export default Dashboard;
