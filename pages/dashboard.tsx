import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import css from '@styled-system/css'
import Styled from "styled-components";
import { Box } from "@contco/core-ui";
import Loading from "../components/Loading";
import Header from '../components/Header';
import Assets from '../components/Asset';
import MarketValue from '../components/MarketValue';
import Borrowing from '../components/Borrowing';
import Pools from '../components/Pools';
import Rewards from '../components/Rewards';
import { GET_ANC_ACCOUNT_DATA } from '../graphql/anc';
import { useQuery } from '@apollo/client';
import { getAssets } from '../graphql/queries/getAssets';
import { ADDRESS_KEY, LOCAL_ADDRESS_TYPE, WALLET_ADDRESS_TYPE } from '../constants';
import Airdrops from "../components/Airdrop";

import useWallet from '../lib/useWallet';

const Body = Styled(Box)`
${css({
  m: 'auto',
  width: ['90%', null, '75%'],
  mt: 20,
})}
`;
const ADDRESS_ANC = `terra18jg24fpqvjntm2wfc0p47skqccdr9ldtgl5ac9`;
const ADDRESS_MIR = 'terra15s0q4u4cpvsxgyygm7wy70q9tq0nnr8fg0m0q3';

const Dashboard: React.FC = ({ theme, changeTheme }: any) => {
  const [address, setAddress] = useState<string>('');
  const [addressType, setAddressType] = useState<string>(WALLET_ADDRESS_TYPE);
  const { useConnectedWallet } = useWallet();
  const connectedWallet = useConnectedWallet();

  useEffect(() => {
    const localAddress = localStorage.getItem(ADDRESS_KEY);
    const walletAddress = connectedWallet?.terraAddress;
    if (localAddress) {
      setAddress(localAddress);
      setAddressType(LOCAL_ADDRESS_TYPE);
    }
    if (walletAddress) {
      setAddress(walletAddress);
      setAddressType(WALLET_ADDRESS_TYPE);
    }
  }, []);

  const { loading: load, error: err, data: ancdata } = useQuery(GET_ANC_ACCOUNT_DATA, {
    variables: { address: ADDRESS_ANC },
  });

  const { data, loading, error } = useQuery(getAssets, { variables: { address: ADDRESS_MIR } });

  if (loading || load) {
    return <Loading/>;
  }

   if (error || err) {
        return <p>Error</p>
    };


  return (
    <div>
      <Head>
        <title>Tefi App | Dashboard</title>
      </Head>
      <div>
        <Header theme={theme} changeTheme={changeTheme} addressType={addressType} address={address} />
        <Body>
          <MarketValue />
          <Assets mirrorAssets={data?.assets?.mirror || {}} ancAssets={ancdata?.assets?.anchor || {}} />
          <Borrowing ancAssets={ancdata?.assets?.anchor || {}} />
          <Rewards mirrorAssets={data?.assets?.mirror || {}} ancAssets={ancdata?.assets?.anchor || {}} />
          <Pools mirrorAssets={data?.assets?.mirror || {}} ancAssets={ancdata?.assets?.anchor || {}} />
         <Airdrops  mirrorAssets={data?.assets?.mirror || {}}/>
        </Body>
      </div>
    </div>
  );
};

export default Dashboard;
