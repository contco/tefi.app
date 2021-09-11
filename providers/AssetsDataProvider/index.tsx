import React, { ReactNode, createContext, useState, useEffect } from 'react';
import useWallet from '../../lib/useWallet';

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
import useAccounts from '../../utils/useAccounts';

interface ContextProps {
  assets: any;
  error: any;
  refetch: any;
  loading: any;
  refreshing: any;
}

interface Props {
  children: ReactNode;
}

const AssetContext = createContext<ContextProps>({
  assets: null,
  error: false,
  refetch: null,
  loading: false,
  refreshing: false,
});

const AssetsDataProvider: React.FC<Props> = ({ children }) => {
  const [address, setAddress] = useState<string>('');
  const { useConnectedWallet } = useWallet();
  const connectedWallet = useConnectedWallet();

  useEffect(() => {
    const walletAddress = connectedWallet?.terraAddress;
    if (walletAddress) {
      setAddress(walletAddress);
    }
  }, [connectedWallet?.terraAddress]);

  const { data, loading, error, refetch, refreshing } = useAccounts(address);

  const assets = data
    ? {
        anchorEarn: getAnchorEarnData(data?.assets?.anchor?.earn),
        anchorBond: getAnchorBondData(data?.assets?.anchor?.burn),
        anchorBorrow: getAnchorBorrowData(data?.assets?.anchor?.debt),
        lunaStaking: getLunaStakingData(data?.assets?.core),
        mirrorShortFarm: getMirrorShortFarmData(data?.assets?.mirror?.mirrorShortFarm),
        mirrorBorrow: getMirrorBorrowData(data?.assets?.mirror?.mirrorShortFarm),
        pylon: getPylonGatewayData(data?.assets?.pylon),
        specFarm: getSpecFarmData(data?.assets?.spectrum),
        specReward: getSpecRewardData(data?.assets?.spectrum),
        starterraFarms: getStarterraFarms(data?.assets?.starterra),
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

  return (
    <AssetContext.Provider value={{ assets, loading, error, refetch, refreshing }}>{children}</AssetContext.Provider>
  );
};

export default AssetsDataProvider;

export function useAssetsDataContext(): ContextProps {
  const context = React.useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAssetsDataContext must be used within AssetProvider');
  }
  return context;
}
