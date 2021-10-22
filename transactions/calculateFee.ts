import { MsgSend, MsgExecuteContract, Coins, StdFee } from '@terra-money/terra.js';
import { simulateTx } from './simulateTx';

export const calculateFee = async (
  address: string,
  msgs: MsgSend[] | MsgExecuteContract[],
  tax: any,
  gasPrice: string,
  denom: string,
  memo?: string,
) => {
  try {
    const { estimatedFee, gas } = await simulateTx(address, msgs, gasPrice, denom, memo);
    const gasFee = new Coins({ [denom]: estimatedFee });
    const feeAmounts = tax ? gasFee.add(tax) : gasFee;
    const fee = new StdFee(gas, feeAmounts);
    return { fee, estimatedFee, gas };
  } catch (err) {
    return { error: true, msg: 'Error calculating fee' };
  }
};
