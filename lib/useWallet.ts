import { WalletConnectType } from "../constants";

const useWalletConnect = () => {
  if(typeof window !== undefined) {
    const {ConnectType, useWallet, useConnectedWallet}= require("@terra-money/wallet-provider");
    
    const { availableConnectTypes, availableInstallTypes, connect, install, disconnect } = useWallet();

    const onConnect = (type: WalletConnectType) => {
      if (type === WalletConnectType.Mobile) {
        connect(ConnectType.WALLETCONNECT);
      } 
      else {
      if(availableInstallTypes.includes(ConnectType.CHROME_EXTENSION)) {
        install(ConnectType.CHROME_EXTENSION)
      }
      if(availableConnectTypes.includes(ConnectType.CHROME_EXTENSION)) {
        connect(ConnectType.CHROME_EXTENSION);
      }
      else if ( availableConnectTypes.includes(ConnectType.WEBEXTENSION)) {
        connect(ConnectType.WEBEXTENSION);
      }
     }
    }
    return {onConnect, useConnectedWallet, disconnect};
  }

  return {onConnect: null, connectedWallet: null, disconnect: null};

};

export default useWalletConnect;