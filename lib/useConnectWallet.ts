import { useState } from 'react';
import { ConnectType, useWallet } from "@terra-money/wallet-provider"
import { useRouter } from 'next/router';

export default () => {
  const { availableConnectTypes, availableInstallTypes, connect, install } = useWallet();

  const onConnect = () => {
    if(availableInstallTypes.includes(ConnectType.CHROME_EXTENSION)) {
      install(ConnectType.CHROME_EXTENSION)
    }
    else if ( availableConnectTypes.includes(ConnectType.WEBEXTENSION)) {
      connect(ConnectType.WEBEXTENSION);
    }
  }

  return {onConnect };
};
