import { Msg, LCDClient} from "@terra-money/terra.js";
import networks from '../utils/networks';
import {ceil, times} from '../utils/math';

const DEFAULT_GAS_ADJUSTMENT = 1.75;

const calcFeeFromGas = (gas: string, gasPrice: string) => {
    return ceil(times(gas, gasPrice))
}

export const simulateTx = async (address: string, msgs: Msg[], gasPrice: string, denom = 'uusd', memo = undefined, gasAdjustment = DEFAULT_GAS_ADJUSTMENT) => {
  const txOptions = { msgs, feeDenoms: [denom], memo, gasAdjustment};
  const gasPrices = { [denom]: gasPrice };
  const lcd = new LCDClient({ chainID: networks.mainnet.chainID, URL: networks.mainnet.lcd, gasPrices })
  const unsignedTx = await lcd.tx.create(address, txOptions);

  const gas = String(unsignedTx.fee.gas)
  const estimatedFee = calcFeeFromGas(gas, gasPrice);
  
  return {unsignedTx, gas: unsignedTx.fee.gas, estimatedFee: estimatedFee ?? '0'};
}