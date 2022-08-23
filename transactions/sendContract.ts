import { calculateFee } from './calculateFee';
import { GAS_PRICES } from './gasPrices';
import { UNIT } from '../pages/api/mirror/utils';

export const simulateSendContractMsg = async (sender: string, msgs: any, isTestnet = false) => {
  try {
    const feeDenom = 'uusd';
    const gasPrice = GAS_PRICES[feeDenom];
    const { estimatedFee } = await calculateFee(sender, msgs, null, gasPrice, feeDenom, '', isTestnet);
    const fee = (+estimatedFee / +UNIT).toString();
    return { fee, feeInLamports: estimatedFee, error: false };
  } catch (err) {
    return { error: true, fee: '0', feeInLamports: '0' };
  }
};
