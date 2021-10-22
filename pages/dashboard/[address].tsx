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
import NftComponent from '../../components/NftComponent';
import TopBar, { ACCOUNT } from '../../components/DashboardComponents/TopBar';
import DashboardComponents from '../../components/DashboardComponents';
import { useQuery, NetworkStatus } from '@apollo/client';
import { useDgraphClient } from '../../lib/dgraphClient';
import { GET_PROFILE_NFT } from '../../graphql/queries/getProfileNFT';
import { getAssets } from '../../graphql/queries/getAssets';

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
  const [initialNftLoading, setInitialNftLoading] = useState<boolean>(true);
  const [randomEarthData, setRandomEarthData] = useState(null);
  const [nftAssets, setNftAssets] = useState<any>(null);

  const {
    data,
    loading: assetsLoading,
    error,
    refetch: refetchQuery,
    networkStatus,
  } = useQuery(getAssets, {
    variables: { address: address },
    notifyOnNetworkStatusChange: true,
  });

  const refreshing = networkStatus === NetworkStatus.refetch && assetsLoading;
  const loading = !refreshing && assetsLoading;
  const refetch = () => refetchQuery({ address: address });

  const {
    data: profileNftData,
    called: profileNftCalled,
    loading: profileNftLoading,
  } = useQuery(GET_PROFILE_NFT, { client: useDgraphClient(), variables: { address } });

  useEffect(() => {
    const fetchRandomEarthNftData = async (addr) => {
      try {
        const jsonResponse = await fetch(`/api/nft/${addr}`);
        const result = await jsonResponse.json();
        setRandomEarthData(result);
      } catch (err) {
        setRandomEarthData(null);
      }
      setInitialNftLoading(false);
    };
    fetchRandomEarthNftData(address);
  }, [address]);

  useEffect(() => {
    const randomEarthNfts = randomEarthData?.items ? randomEarthData?.items : [];
    const knowhereNfts = profileNftData?.getProfileNft?.nftAssets ? profileNftData?.getProfileNft?.nftAssets : [];
    const nftList = [...randomEarthNfts, ...knowhereNfts];
    setNftAssets(nftList);
  }, [randomEarthData, profileNftData?.getProfileNft?.nftAssets]);

  const assets = assignData(data);

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
              <Loading currentTheme={theme} />
            ) : !assets || JSON.stringify(assets) === '{}' ? (
              <EmptyComponent msg={getErrorMessage()} refetch={refetch} error={error} refreshing={refreshing} />
            ) : (
              <DashboardComponents assets={assets} />
            )
          ) : (
            <NftComponent nftAssets={nftAssets} loading={initialNftLoading} address={address} currentTheme={theme} />
          )}
        </Body>
      </div>
    </div>
  );
};

export default Dashboard;
