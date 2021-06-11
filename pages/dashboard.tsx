import React, { useEffect, useState} from 'react';
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
import {ADDRESS_KEY, LOCAL_ADDRESS_TYPE, WALLET_ADDRESS_TYPE} from "../constants";

import useWallet from "../lib/useWallet";

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
    
    const [address, setAddress] = useState<string>('');
    const [addressType, setAddressType] = useState<string>(WALLET_ADDRESS_TYPE);
    const {useConnectedWallet} = useWallet();
    const connectedWallet = useConnectedWallet();

    useEffect(() => {
      let localAddress = localStorage.getItem(ADDRESS_KEY);
      let walletAddress = connectedWallet?.terraAddress;
      if(localAddress) {
        setAddress(localAddress);
        setAddressType(LOCAL_ADDRESS_TYPE);
      };
      if (walletAddress) {
        setAddress(walletAddress);
        setAddressType(WALLET_ADDRESS_TYPE);
      }
    }, [])
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
