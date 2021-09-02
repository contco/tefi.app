import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import css from '@styled-system/css';
import Styled from 'styled-components';
import { Box } from '@contco/core-ui';
import { AccAddress } from '@terra-money/terra.js';
import { NetworkStatus, useLazyQuery } from '@apollo/client';
import Loading from '../../components/Loading';
import EmptyComponent from '../../components/EmptyComponent';
import Header from '../../components/Header';
import Assets from '../../components/Asset';
import LunaStaking from '../../components/LunaStaking';
import MarketValue from '../../components/MarketValue';
import Borrowing from '../../components/Borrowing';
import PylonGateway from '../../components/PylonGateway';
import Pools from '../../components/Pools';
import SpectrumFarms from '../../components/SpectrumFarms';
import SpectrumRewards from '../../components/SpectrumRewards';
import Rewards from '../../components/Rewards';
import Loterra from '../../components/ؒLoterra';
import { getAssets } from '../../graphql/queries/getAssets';
import Airdrops from '../../components/Airdrop';
import { NextSeo } from 'next-seo';
import { DashboardSEO } from '../../next-seo.config';
import Earn from '../../components/Earn';
import Burn from '../../components/Burn';
import ShortFarms from '../../components/ShortFarms';
import MirrorBorrowing from '../../components/MirrorBorrowing';

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

  const [fetchAssets, { data, called, loading: dataLoading, error, refetch, networkStatus }] = useLazyQuery(getAssets, {
    variables: { address: address },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (address && isValidAddress) {
      fetchAssets({ variables: { address } });
    }
  }, [address, isValidAddress]);


  useEffect(() => {
    if (error && fetchCount !== MAX_TRY) {
      setFetchCount(fetchCount + 1);
      setTimeout(() => {
        refetch();
      }, 3000);
    }
  }, [error]);

  const getErrorMessage = () => {
      if(error) {
          return 'Oops! Error Fetching Assets';
      }
      else if (!isValidAddress) {
          return 'Terra Address is not valid';
      }
      return null;
  }

  const loading = isValidAddress ?
    (!called || dataLoading || (!data && fetchCount !== MAX_TRY)) && networkStatus !== NetworkStatus.refetch : false;

  return (
    <div>
      <NextSeo {...DashboardSEO} />
      <div>
        <Header
          onRefresh={loading ? null : () => refetch()}
          refreshing={networkStatus == NetworkStatus.refetch}
          theme={theme}
          changeTheme={changeTheme}
          addressType={''}
          address={isValidAddress ? address : ''}
          isViewOnly={true}
        />
        {loading ? (
          <Loading />
        ) :  !isValidAddress || !data || data?.length === 0 ? (
          <EmptyComponent msg={getErrorMessage()} />
        ) : (
          <Body>
            <MarketValue
              core={data?.assets.core || {}}
              pylonAssets={data?.assets?.pylon || {}}
              mirrorAssets={data?.assets?.mirror || {}}
              ancAssets={data?.assets?.anchor || {}}
              spectrum={data?.assets?.spectrum}
              loterra={data?.assets?.loterra}
              terraSwapAssets={data?.assets?.terraSwapPool}
            />
            <Assets
              mirrorAssets={data?.assets?.mirror || {}}
              core={data?.assets.core}
              ancAssets={data?.assets?.anchor || {}}
              pylonAssets={data?.assets?.pylon || {}}
              spectrum={data?.assets?.spectrum}
            />
            <PylonGateway pylonAssets={data?.assets?.pylon || {}} />
            <Earn ancAssets={data?.assets?.anchor || {}} />
            <Burn ancAssets={data?.assets?.anchor || {}} />
            <Borrowing ancAssets={data?.assets?.anchor || {}} />
            <Rewards
              pylonAssets={data?.assets?.pylon || {}}
              mirrorAssets={data?.assets?.mirror || {}}
              ancAssets={data?.assets?.anchor || {}}
              spectrum={data?.assets?.spectrum}
              loterra={data?.assets?.loterra}
            />
            <Pools
              pylonAssets={data?.assets?.pylon || {}}
              mirrorAssets={data?.assets?.mirror || {}}
              ancAssets={data?.assets?.anchor || {}}
              terraSwapAssets={data?.assets?.terraSwapPool}
            />
            <MirrorBorrowing mirrorAssets={data?.assets?.mirror || {}} />
            <ShortFarms mirrorAssets={data?.assets?.mirror || {}} />
            <SpectrumFarms spectrum={data?.assets?.spectrum} />
            <SpectrumRewards spectrum={data?.assets?.spectrum} />
            <Loterra loterra={data?.assets?.loterra} />
            <LunaStaking core={data?.assets.core || {}} />
            <Airdrops
              isViewOnly={true}
              pylonAssets={data?.assets?.pylon || {}}
              mirrorAssets={data?.assets?.mirror || {}}
              anchorAssets={data?.assets?.anchor}
            />
          </Body>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
