import { MsgSend, MsgExecuteContract } from '@terra-money/terra.js';
import { simulateTx } from './simulateTx';

export const calculateFee = async (
  address: string,
  msgs: MsgSend[] | MsgExecuteContract[],
  tax: any,
  gasPrice: string,
  denom: string,
  memo?: string,
  isTestnet = false,
) => {
  try {
    const { estimatedFee, gas } = await simulateTx(address, msgs, gasPrice, denom, memo, isTestnet);
    return { estimatedFee, gas };
  } catch (err) {
    return { error: true, msg: 'Error calculating fee' };
  }
};
