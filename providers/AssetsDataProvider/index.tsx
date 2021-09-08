import React, { ReactNode, createContext, useState, useEffect } from 'react';
import useWallet from '../../lib/useWallet';
import { useLazyQuery, NetworkStatus } from '@apollo/client';
import { getAssets } from '../../graphql/queries/getAssets';
import {
  getAirdropsData,
  getAnchorBondData,
  getAnchorBorrowData,
  getAnchorEarnData,
  getAssetData,
  getLoterraData,
  getLunaStakingData,
  getMirrorBorrowData,
  getMirrorShortFarmData,
  getPoolData,
  getPylonGatewayData,
  getRewardData,
  getSpecFarmData,
  getSpecRewardData,
  getStarterraFarms,
} from './helpers';

const MAX_TRY = 3;

interface ContextProps {
  assets: any;
  error: any;
  refetch: any;
  loader: any;
}

interface Props {
  children: ReactNode;
}

const AssetContext = createContext<ContextProps>({
  assets: null,
  error: false,
  refetch: null,
  loader: false,
});

const AssetsDataProvider: React.FC<Props> = ({ children }) => {
  const [address, setAddress] = useState<string>('');
  const [fetchCount, setFetchCount] = useState<number>(0);
  const { useConnectedWallet } = useWallet();
  const connectedWallet = useConnectedWallet();

  useEffect(() => {
    const walletAddress = connectedWallet?.terraAddress;
    if (walletAddress) {
      setAddress(walletAddress);
    }
  }, [connectedWallet?.terraAddress]);

  const [fetchAssets, { data, called, loading: dataLoading, error, refetch, networkStatus }] = useLazyQuery(getAssets, {
    variables: { address: address },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (address) {
      fetchAssets({ variables: { address } });
    }
  }, [address]);

  useEffect(() => {
    if (error && fetchCount !== MAX_TRY) {
      setFetchCount(fetchCount + 1);
      setTimeout(() => {
        refetch();
      }, 3000);
    }
  }, [error]);

  const loader =
    (!called || dataLoading || (!data && fetchCount !== MAX_TRY)) && networkStatus !== NetworkStatus.refetch;

  const assets = data
    ? {
        anchorEarn: getAnchorEarnData(data?.assets?.anchor?.earn),
        anchorBond: getAnchorBondData(data?.assets?.anchor?.burn),
        anchorBorrow: getAnchorBorrowData(data?.assets?.anchor?.debt),
        lunaStaking: getLunaStakingData(data?.assets?.core),
        mirrorShortFarm: getMirrorShortFarmData(data?.assets?.mirror?.mirrorShortFarm),
        mirrorBorrow: getMirrorBorrowData(data?.assets?.mirror?.mirrorShortFarm),
        pylonGateway: getPylonGatewayData(data?.assets?.pylon),
        specFarm: getSpecFarmData(data?.assets?.spectrum),
        specReward: getSpecRewardData(data?.assets?.spectrum),
        starterra: getStarterraFarms(data?.assets?.starterra),
        assets: getAssetData(
          data?.assets?.anchor,
          data?.assets?.mirror,
          data?.assets?.pylon,
          data?.assets?.core,
          data?.assets?.spectrum,
        ),
        pools: getPoolData(
          data?.assets?.anchor,
          data?.assets?.mirror,
          data?.assets?.pylon,
          data?.assets?.terraSwapPool,
        ),
        rewards: getRewardData(
          data?.assets?.anchor,
          data?.assets?.mirror,
          data?.assets?.pylon,
          data?.assets?.spectrum,
          data?.assets?.loterra,
        ),
        airdrops: getAirdropsData(data?.assets?.anchor, data?.assets?.mirror, data?.assets?.pylon),
        loterra: getLoterraData(data?.assets?.loterra),
      }
    : {};

  return <AssetContext.Provider value={{ assets, loader, error, refetch }}>{children}</AssetContext.Provider>;
};

export default AssetsDataProvider;

export function useAssetsDataContext(): ContextProps {
  const context = React.useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAssetsDataContext must be used within AssetProvider');
  }
  return context;
}
