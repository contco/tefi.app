import React, { useEffect, useState } from 'react';
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
import { GET_ANC_ACCOUNT_DATA } from '../graphql/anc';
import { useQuery } from '@apollo/client';
import { getAssets } from '../graphql/queries/getAssets';
import { ADDRESS_KEY, LOCAL_ADDRESS_TYPE, WALLET_ADDRESS_TYPE } from '../constants';

import useWallet from '../lib/useWallet';

const Body = Styled(Box)`
${css({
  m: 'auto',
  width: ['90%', null, '75%'],
  mt: 20,
})}
`;
const ADDRESS = `terra18jg24fpqvjntm2wfc0p47skqccdr9ldtgl5ac9`;

const Dashboard: React.FC = ({ theme, changeTheme }: any) => {
  const [address, setAddress] = useState<string>('');
  const [addressType, setAddressType] = useState<string>(WALLET_ADDRESS_TYPE);
  const { useConnectedWallet } = useWallet();
  const connectedWallet = useConnectedWallet();

  const queryMultiple = () => {
    const res1 = useQuery(GET_ANC_ACCOUNT_DATA, { variables: { address: ADDRESS } });
    const res2 = useQuery(getAssets, { variables: { address: ADDRESS } });
    return [res1, res2];
  };

  const [{ loading: loading1, data: data1 }, { loading: loading2, data: data2 }] = queryMultiple();

  if (loading1 && loading2) {
    return <p>Loading</p>;
  }

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

  return (
    <div>
      <Head>
        <title>Tefi App | Dashboard</title>
      </Head>
      <div>
        <Header theme={theme} changeTheme={changeTheme} addressType={addressType} address={address} />
        <Body>
          <MarketValue />
          <Assets mirrorAssets={data2?.assets?.mirror || {}} ancAssets={data1?.assets?.anchor || {}} />
          <Borrowing ancAssets={data1?.assets?.anchor || {}} />
          <Rewards mirrorAssets={data2?.assets?.mirror || {}} ancAssets={data1?.assets?.anchor || {}} />
          <Pools mirrorAssets={data2?.assets?.mirror || {}} ancAssets={data1?.assets?.anchor || {}} />
        </Body>
      </div>
    </div>
  );
};

export default Dashboard;
