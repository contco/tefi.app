import React, { useState } from 'react';
import { useRouter } from 'next/router';
import css from '@styled-system/css';
import Styled from 'styled-components';
import { Box } from '@contco/core-ui';
import { AccAddress } from '@terra-money/terra.js';
import Loading from '../../components/Loading';
import EmptyComponent from '../../components/EmptyComponent';
import Header from '../../components/Header';
import { NextSeo } from 'next-seo';
import { DashboardSEO } from '../../next-seo.config';
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
  const router = useRouter();
  const address = router?.query?.address as string;
  const isValidAddress = AccAddress.validate(address);
  const [currentBar, setCurrentBar] = useState(ACCOUNT);

  const { assets, isLoading, isError, refetch, isRefetching } = useAccount(address);

  const getErrorMessage = () => {
    if (isError) {
      return 'Oops! Error Fetching Assets';
    } else if (!isValidAddress) {
      return 'Terra Address is not valid';
    }
    return null;
  };

  return (
    <div>
      <NextSeo {...DashboardSEO} />
      <div>
        <Header
          onRefresh={isLoading ? null : () => refetch()}
          refreshing={isRefetching}
          theme={theme}
          changeTheme={changeTheme}
          addressType={''}
          address={isValidAddress ? address : ''}
          isViewOnly={true}
        />
        <Body>
          <TopBar currentBar={currentBar} setCurrentBar={setCurrentBar} currentTheme={theme} />
          {isLoading ? (
            <Loading currentTheme={theme} />
          ) : !assets || JSON.stringify(assets) === '{}' ? (
            <EmptyComponent msg={getErrorMessage()} refetch={refetch} error={isError} refreshing={isRefetching} />
          ) : (
            <DashboardComponents assets={assets} />
          )}
        </Body>
      </div>
    </div>
  );
};

export default Dashboard;
