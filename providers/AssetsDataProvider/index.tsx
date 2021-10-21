import React, { ReactNode, createContext, useState, useEffect } from 'react';
import { useLazyQuery, NetworkStatus } from '@apollo/client';
import { getAssets } from '../../graphql/queries/getAssets';
import { ADDRESS_KEY } from '../../constants';
import useWallet from '../../lib/useWallet';
import { assignData } from './assignData';

interface ContextProps {
  assets: any;
  error: any;
  data: any;
  refetch: any;
  loading: any;
  refreshing: any;
  updateAccountData: any;
}

interface Props {
  children: ReactNode;
}

const AssetContext = createContext<ContextProps>({
  assets: null,
  data: null,
  error: false,
  refetch: null,
  loading: false,
  refreshing: false,
  updateAccountData: null,
});

const AssetsDataProvider: React.FC<Props> = ({ children }) => {
  const [address, setAddress] = useState<string>('');
  const [accountData, setAccountData] = useState<any>(null);
  const { useConnectedWallet } = useWallet();
  const connectedWallet = useConnectedWallet();
	const localAddress = localStorage.getItem(ADDRESS_KEY);

  const [fetchAssets, { data, loading: assetsLoading, error, refetch: refetchQuery, networkStatus }] = useLazyQuery(getAssets, {
    variables: { address: address },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    const walletAddress = connectedWallet?.terraAddress;
    if (walletAddress) {
      setAddress(walletAddress);
      fetchAssets({variables: {address: walletAddress}});
    } else if (localAddress) {
      setAddress(localAddress);
      fetchAssets({variables: {address: walletAddress}});
    }
  }, [localAddress, connectedWallet]);

  const refreshing = networkStatus === NetworkStatus.refetch && assetsLoading;
  const loading = !refreshing && assetsLoading;
  const refetch = () => refetchQuery({address: address});

  useEffect(() => {
    setAccountData(data);
  }, [data])

  const assets = React.useMemo(() => {
    
    if(accountData) {
      const assetsData = assignData(accountData);
      return assetsData;
    }
    return null;

  }, [accountData]);

  const updateAccountData = (newAccountData: any) => {
    setAccountData(newAccountData);
  }

  return (
    <AssetContext.Provider value={{ assets, data: accountData, loading, error, refetch, refreshing, updateAccountData }}>{children}</AssetContext.Provider>
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
