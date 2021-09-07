import React, { ReactNode, createContext, useState, useEffect} from 'react';
import useWallet from '../../lib/useWallet';
import { useLazyQuery, NetworkStatus } from '@apollo/client';
import { getAssets } from '../../graphql/queries/getAssets';

const MAX_TRY = 3;

interface ContextProps{
    assets: any;
    error: any; 
    refetch: any;
    loading: any;
}

interface Props {
  children: ReactNode;
}

const AssetContext = createContext<ContextProps>({
  assets: null,
  error: false,
  refetch: null,
  loading: false,
});

const AssetsProvider: React.FC<Props> = ({ children }) => {
  const [address, setAddress] = useState<string>('');
  const [fetchCount, setFetchCount] = useState<number>(0);
  const { useConnectedWallet} = useWallet();
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

  const loading =
    (!called || dataLoading || (!data && fetchCount !== MAX_TRY)) && networkStatus !== NetworkStatus.refetch;
  
  const assets = data ? [...data?.assets?.core?.coins, ...data?.assets?.anchor?.assets,  ...data?.assets?.mirror?.mirrorHoldings, ...data?.assets?.pylon?.pylonHoldings, ...data?.assets?.spectrum?.specHoldings] : [];

  return (
    <AssetContext.Provider value={{assets, loading, error, refetch}}>
      {children}
    </AssetContext.Provider>
  );
};

export default AssetsProvider;


export function useAssetContext(): ContextProps {
    const context = React.useContext(AssetContext);
    if (context === undefined) {
      throw new Error('useAssetContext must be used within AssetProvider');
    }
    return context;
  }