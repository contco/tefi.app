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
import TopBar, { ACCOUNT } from '../../components/DashboardComponents/TopBar';
import DashboardComponents from '../../components/DashboardComponents';
import { useAccount } from '../../data/useAccount';

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
  const [currentBar, setCurrentBar] = useState(ACCOUNT);

  useEffect(() => {
    const localAddress = localStorage.getItem(ADDRESS_KEY);
    const walletAddress = connectedWallet?.terraAddress;
    if (walletAddress) {
      setAddress(walletAddress);
      setAddressType(WALLET_ADDRESS_TYPE);
    } else {
      if (localAddress) {
        setAddress(localAddress);
        setAddressType(LOCAL_ADDRESS_TYPE);
      }
    }
  }, [address, setAddress]);

  const { assets, isLoading, isError, refetch, isRefetching } = useAccount(address);

  return (
    <div>
      <NextSeo {...DashboardSEO} />
      <div>
        <Header
          onRefresh={isLoading ? null : () => refetch()}
          refreshing={isRefetching}
          theme={theme}
          changeTheme={changeTheme}
          addressType={addressType}
          address={address}
        />
        <Body>
          <TopBar currentBar={currentBar} setCurrentBar={setCurrentBar} currentTheme={theme} />
          {isLoading ? (
            <Loading currentTheme={theme} />
          ) : !assets || JSON.stringify(assets) === '{}' ? (
            <EmptyComponent
              msg={isError ? 'Oops! Error Fetching Assets' : null}
              refetch={refetch}
              error={isError}
              refreshing={isRefetching}
            />
          ) : (
            <DashboardComponents assets={assets} />
          )}
        </Body>
      </div>
    </div>
  );
};

export default Dashboard;
