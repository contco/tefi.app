import { MsgSend, MsgExecuteContract, Coin } from '@terra-money/terra.js';
import { calculateTax } from './calculateTax';
import { GAS_PRICES } from './gasPrices';
import { simulateTx } from './simulateTx';

const DEFAULT_DENOM = 'uusd';
const UNIT = 1000000;

interface SendTokenTransactionData {
  to: string;
  from: string;
  memo?: string;
  denom?: string;
  amount?: string;
  contract?: string;
  txDenom?: string;
  isNFT?: boolean;
  tokenId?: string;
}

const getGasPrice = (denom = DEFAULT_DENOM) => {
  return GAS_PRICES[denom];
};

const getDeductedAmounts = (
  amount: string,
  estimatedFee: string,
  tax: Coin | null,
  feeDenom: string,
  denom: string,
  contract: string,
) => {
  if (denom) {
    const taxData = tax ? tax.toData() : { amount: '0' };
    if (denom === feeDenom) {
      const deductedAmount = parseFloat(amount) + (parseFloat(estimatedFee) + parseFloat(taxData.amount) / UNIT);
      return [{ denom, amount: deductedAmount }];
    } else {
      const denomAmount = { denom, amount: parseFloat(amount) + parseFloat(taxData.amount) / UNIT };
      const feeAmount = { denom: feeDenom, amount: parseFloat(estimatedFee) / UNIT };
      return [denomAmount, feeAmount];
    }
  } else {
    const dedudctedAmount = { contract: contract, amount: parseFloat(amount) };
    const feeAmount = { denom: feeDenom, amount: parseFloat(estimatedFee) / UNIT };
    return [dedudctedAmount, feeAmount];
  }
};

export const sendToken = async (data: SendTokenTransactionData, post) => {
  try {
    const { to, from, amount, memo, denom, txDenom, contract, isNFT, tokenId } = data;
    const amountInLamports = +amount * +UNIT;
    let msgs;
    if (isNFT) {
      msgs = [
        new MsgExecuteContract(from, contract, {
          transfer_nft: { recipient: to, token_id: tokenId },
        }),
      ];
    } else {
      msgs = denom
        ? [new MsgSend(from, to, { [denom]: amountInLamports })]
        : [
            new MsgExecuteContract(from, contract, {
              transfer: { recipient: to, amount: amountInLamports.toString() },
            }),
          ];
    }
    const feeDenom = txDenom ?? DEFAULT_DENOM;
    const tax = feeDenom ? await calculateTax(amountInLamports.toString(), feeDenom) : null;
    const gasPrice = getGasPrice(feeDenom);
    const feeResult = await simulateTx(data.from, msgs, gasPrice, feeDenom, memo);
    if (feeResult.error) {
      return feeResult;
    } else {
      const gasPrices = { [txDenom]: gasPrice };
      const txOptions = {
        msgs,
        memo: memo,
        gasPrices,
        fee: feeResult.fee,
      };
      const deductedAmounts = getDeductedAmounts(amount, feeResult.estimatedFee, tax, feeDenom, denom, contract);
      const result = await post(txOptions);
      return { error: false, msg: '', txResult: result, deductedAmounts };
    }
  } catch ({ message }) {
    return { error: true, msg: message, txResult: null, deductedAmounts: null };
  }
};

export const simulateSendTokenTx = async (data: SendTokenTransactionData) => {
  try {
    const { to, from, amount, memo, denom, txDenom, contract } = data;
    const amountInLamports = +amount * +UNIT;
    const msgs = denom
      ? [new MsgSend(from, to, { [denom]: amountInLamports })]
      : [
          new MsgExecuteContract(from, contract, {
            transfer: { recipient: to, amount: amountInLamports.toString() },
          }),
        ];
    const feeDenom = txDenom ?? DEFAULT_DENOM;
    const gasPrice = getGasPrice(feeDenom);
    const { estimatedFee } = await simulateTx(data.from, msgs, gasPrice, feeDenom, memo);
    const fee = (+estimatedFee / +UNIT).toString();
    return { fee, feeInLamports: estimatedFee, error: false };
  } catch (err) {
    return { error: true, fee: '0', feeInLamports: '0' };
  }
};
