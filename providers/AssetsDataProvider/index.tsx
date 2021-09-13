import React, { ReactNode, createContext, useState, useEffect } from 'react';
import { ADDRESS_KEY } from '../../constants';
import useWallet from '../../lib/useWallet';
import useAccounts from '../../utils/useAccounts';
import { assignData } from './assignData';

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
    const localAddress = localStorage.getItem(ADDRESS_KEY);
    const walletAddress = connectedWallet?.terraAddress;
    if (localAddress) {
      setAddress(localAddress);
    } else if (walletAddress) {
      setAddress(walletAddress);
    }
  }, []);

  const { data, loading, error, refetch, refreshing } = useAccounts(address);

  const assets = assignData(data);

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
