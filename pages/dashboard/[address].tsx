import React, { useEffect, useState } from 'react';
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
import { assignData } from '../../providers/AssetsDataProvider/assignData';
import useAccounts from '../../utils/useAccounts';
import NftComponent from '../../components/NftComponent';
import TopBar, { ACCOUNT } from '../../components/DashboardComponents/TopBar';
import DashboardComponents from '../../components/DashboardComponents';
import { useQuery } from '@apollo/client';
import { useDgraphClient } from '../../lib/dgraphClient';
import { GET_PROFILE_NFT } from '../../graphql/queries/getProfileNFT';

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
  const [fetchCount, setFetchCount] = useState<number>(0);
  const router = useRouter();
  const address = router?.query?.address as string;
  const isValidAddress = AccAddress.validate(address);
  const [currentBar, setCurrentBar] = useState(ACCOUNT);

  const { data, loading, error, refetch, refreshing } = useAccounts(address);
  const { data: profileNftData, called: profileNftCalled, loading: profileNftLoading } = useQuery(GET_PROFILE_NFT, {client: useDgraphClient(), variables: {address}});


  const assets = assignData(data);

  useEffect(() => {
    if (error && fetchCount !== MAX_TRY) {
      setFetchCount(fetchCount + 1);
      setTimeout(() => {
        refetch();
      }, 3000);
    }
  }, [error]);

  const getErrorMessage = () => {
    if (error) {
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
          onRefresh={loading ? null : () => refetch()}
          refreshing={refreshing}
          theme={theme}
          changeTheme={changeTheme}
          addressType={''}
          address={isValidAddress ? address : ''}
          isViewOnly={true}
        />
        <Body>
        <TopBar 
            currentBar={currentBar}
            setCurrentBar={setCurrentBar}
            currentTheme={theme}
            profileNftLoading={profileNftLoading || !profileNftCalled}
            profileNft={profileNftData?.getProfileNft} 
          />
          {currentBar === ACCOUNT ? (
            loading ? (
              <Loading />
            ) : !assets || JSON.stringify(assets) === '{}' ? (
              <EmptyComponent msg={getErrorMessage()} />
            ) : (
              <DashboardComponents assets={assets} />
            )
          ) : (
            <NftComponent address={address} currentTheme={theme} />
          )}
        </Body>
      </div>
    </div>
  );
};

export default Dashboard;
