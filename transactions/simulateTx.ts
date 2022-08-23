import { Msg, LCDClient } from '@terra-money/terra.js';
import networks from '../utils/networks';

const DEFAULT_GAS_ADJUSTMENT = 2;

export const simulateTx = async (
  address: string,
  msgs: Msg[],
  gasPrice: string,
  denom = 'uusd',
  memo = null,
  isTestnet: boolean,
  gasAdjustment = DEFAULT_GAS_ADJUSTMENT,
) => {
  const txOptions = { msgs, feeDenoms: [denom], memo, gasAdjustment };
  const gasPrices = { [denom]: gasPrice };
  const lcd = isTestnet
    ? new LCDClient({ chainID: networks.testnet.chainID, URL: networks.testnet.lcd, gasPrices })
    : new LCDClient({ chainID: networks.mainnet.chainID, URL: networks.mainnet.lcd, gasPrices });

  const unsignedTx = await lcd.tx.create([{ address }], txOptions);
  const estimatedFee = unsignedTx.auth_info.fee.toAmino();
  const gas = estimatedFee.gas;
  const amount = estimatedFee.amount[0].amount;
  return { unsignedTx, gas, estimatedFee: amount };
};
