import { FC, ReactChildren, ReactChild, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { NetworkInfo } from '@terra-money/wallet-provider';
import networks from '../utils/networks';

const DynamicWalletProvider: any = dynamic(
  () =>
    import('@terra-money/wallet-provider').then((module) => {
      return module.WalletProvider;
    }),
  { ssr: false },
);

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: networks.testnet,
  1: networks.mainnet,
};

interface WalletConnectProviderProps {
  children: ReactChild | ReactChildren | ReactNode;
}

const WalletConnectProvider: FC<WalletConnectProviderProps> = ({ children }) => {
  return (
    <DynamicWalletProvider
      defaultNetwork={networks.mainnet}
      walletConnectChainIds={walletConnectChainIds}
      connectorOpts={{ bridge: 'https://walletconnect.terra.dev/' }}
    >
      {children}
    </DynamicWalletProvider>
  );
};

export default WalletConnectProvider;
