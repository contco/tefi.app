import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import css from '@styled-system/css';
import Styled from 'styled-components';
import { Box } from '@contco/core-ui';
import Loading from '../components/Loading';
import Header from '../components/Header';
import Assets from '../components/Asset';
import LunaStaking from '../components/LunaStaking';
import MarketValue from '../components/MarketValue';
import Borrowing from '../components/Borrowing';
import PylonGateway from '../components/PylonGateway';
import Pools from '../components/Pools';
import Rewards from '../components/Rewards';
import { useQuery } from '@apollo/client';
import { getAssets } from '../graphql/queries/getAssets';
import { ADDRESS_KEY, LOCAL_ADDRESS_TYPE, WALLET_ADDRESS_TYPE } from '../constants';
import Airdrops from '../components/Airdrop';

import useWallet from '../lib/useWallet';
import Earn from '../components/Earn';

const Body = Styled(Box)`
${css({
  m: 'auto',
  width: ['90%', null, '75%'],
  mt: 20,
  overflowX: ['scroll', null, null, null, null, 'hidden'],
})}
`;

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
    } else if (walletAddress) {
      setAddress(walletAddress);
      setAddressType(WALLET_ADDRESS_TYPE);
    }
  }, []);

  const { data, loading, error, refetch } = useQuery(getAssets, {
    variables: { address: address },
  });

  useEffect(() => {
    if (error) {
      refetch();
    }
  }, [error]);

  if (loading || error) {
    return <Loading />;
  }

  return (
    <div>
      <Head>
        <title>Tefi App | Dashboard</title>
      </Head>
      <div>
        <Header theme={theme} changeTheme={changeTheme} addressType={addressType} address={address} />
        <Body>
          <MarketValue
            core={data?.assets.core || {}}
            pylonAssets={data?.assets?.pylon || {}}
            mirrorAssets={data?.assets?.mirror || {}}
            ancAssets={data?.assets?.anchor || {}}
          />
          <Assets
            mirrorAssets={data?.assets?.mirror || {}}
            core={data?.assets.core}
            ancAssets={data?.assets?.anchor || {}}
            pylonAssets={data?.assets?.pylon || {}}
          />
          <PylonGateway pylonAssets={data?.assets?.pylon || {}} />
          <Earn ancAssets={data?.assets?.anchor || {}} />
          <Borrowing ancAssets={data?.assets?.anchor || {}} />
          <Rewards
            pylonAssets={data?.assets?.pylon || {}}
            mirrorAssets={data?.assets?.mirror || {}}
            ancAssets={data?.assets?.anchor || {}}
          />
          <Pools
            pylonAssets={data?.assets?.pylon || {}}
            mirrorAssets={data?.assets?.mirror || {}}
            ancAssets={data?.assets?.anchor || {}}
          />
          <LunaStaking core={data?.assets.core || {}} />
          <Airdrops
            pylonAssets={data?.assets?.pylon || {}}
            mirrorAssets={data?.assets?.mirror || {}}
            anchorAssets={data?.assets?.anchor}
          />
        </Body>
      </div>
    </div>
  );
};

export default Dashboard;
