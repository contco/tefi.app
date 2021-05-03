import { useState } from 'react';
import { Extension } from '@terra-money/terra.js';

export default () => {
  const [wallet, setWallet] = useState<any>();
  const ext = new Extension();
  const connect = () => {
    ext.connect();
    ext.on('onConnect', setWallet);
  };

  return { connect, wallet };
};
