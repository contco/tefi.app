import { useWallet, useConnectedWallet, ConnectType } from '@terra-money/wallet-provider';
import { WalletConnectType } from '../constants';

const useWalletConnect = () => {
  const { availableConnectTypes, availableInstallTypes, connect, install, disconnect, post } = useWallet();

  const onConnect = (type: WalletConnectType) => {
    if (type === WalletConnectType.Mobile) {
      connect(ConnectType.WALLETCONNECT);
    } else {
      if (availableInstallTypes.includes(ConnectType.EXTENSION)) {
        install(ConnectType.EXTENSION);
      }
      if (availableConnectTypes.includes(ConnectType.EXTENSION)) {
        connect(ConnectType.EXTENSION);
      }
    }
  };
  return { onConnect, useConnectedWallet, disconnect, post };
};

export default useWalletConnect;
