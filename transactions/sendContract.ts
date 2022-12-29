import { MsgSend, MsgExecuteContract } from '@terra-money/terra.js';
import { simulateTx } from './simulateTx';
import { GAS_PRICES } from './gasPrices';

const feeDenom = 'uluna';
const gasPrice = GAS_PRICES[feeDenom];
const UNIT = 1000000;

interface Data {
  msgs: MsgExecuteContract[] | MsgSend[];
  sender: string;
}

export const sendContractMsg = async (data: Data, post) => {
  try {
    const { msgs, sender } = data;
    const gasPrice = GAS_PRICES[feeDenom];
    const feeResult = await simulateTx(sender, msgs, gasPrice, feeDenom, '');
    if (feeResult.error) {
      return feeResult;
    } else {
      const gasPrices = { [feeDenom]: gasPrice };
      const txOptions = {
        msgs,
        gasPrices,
        fee: feeResult.fee,
      };
      const result = await post(txOptions);
      return { error: false, msg: '', txResult: result };
    }
  } catch (err) {
    return { error: true, msg: err, txResult: null, deductedAmounts: null };
  }
};

export const simulateSendContractMsg = async (sender: string, msgs: any) => {
  try {
    const { estimatedFee } = await simulateTx(sender, msgs, gasPrice, feeDenom, '');
    const fee = (+estimatedFee / +UNIT).toString();
    return { fee, feeInLamports: estimatedFee, error: false };
  } catch (err) {
    return { error: true, fee: '0', feeInLamports: '0' };
  }
};
