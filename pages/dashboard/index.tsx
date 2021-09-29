import React, { useEffect, useState } from 'react';
import css from '@styled-system/css';
import Styled from 'styled-components';
import { Box } from '@contco/core-ui';
import Loading from '../../components/Loading';
import EmptyComponent from '../../components/EmptyComponent';
import Header from '../../components/Header';

import { ADDRESS_KEY, LOCAL_ADDRESS_TYPE, WALLET_ADDRESS_TYPE } from '../../constants';
import { NextSeo } from 'next-seo';
import { DashboardSEO } from '../../next-seo.config';
import useWallet from '../../lib/useWallet';

import { useAssetsDataContext } from '../../contexts';
import NftComponent from '../../components/NftComponent';
import TopBar, { ACCOUNT } from '../../components/DashboardComponents/TopBar';
import DashboardComponents from '../../components/DashboardComponents';

const MAX_TRY = 3;

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
  const [fetchCount, setFetchCount] = useState<number>(0);
  const { useConnectedWallet } = useWallet();
  const connectedWallet = useConnectedWallet();
  const [currentBar, setCurrentBar] = useState(ACCOUNT);

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
  }, [address, setAddress]);

  const { assets, loading, error, refetch, refreshing } = useAssetsDataContext();

  useEffect(() => {
    if (error && fetchCount !== MAX_TRY) {
      setFetchCount(fetchCount + 1);
      setTimeout(() => {
        refetch();
      }, 3000);
    }
  }, [error]);

  return (
    <div>
      <NextSeo {...DashboardSEO} />
      <div>
        <Header
          onRefresh={loading ? null : () => refetch()}
          refreshing={refreshing}
          theme={theme}
          changeTheme={changeTheme}
          addressType={addressType}
          address={address}
        />
        <Body>
          <TopBar currentBar={currentBar} setCurrentBar={setCurrentBar} currentTheme={theme} />
          {currentBar === ACCOUNT ? (
            loading ? (
              <Loading />
            ) : !assets || JSON.stringify(assets) === '{}' ? (
              <EmptyComponent msg={error ? 'Oops! Error Fetching Assets' : null} />
            ) : (
              <DashboardComponents assets={assets} />
            )
          ) : (
            <NftComponent currentTheme={theme} />
          )}
        </Body>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  return {
    redirect: {
      destination: '/col-5',
      permanent: false,
    },
  };
}

export default Dashboard;
