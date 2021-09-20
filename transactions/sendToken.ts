import axios from 'axios';
import { MsgSend, MsgExecuteContract, Coin} from "@terra-money/terra.js";
import { FCD_URL } from '../pages/api/utils';
import { UNIT } from '../pages/api/mirror/utils';
import BigNumber from 'bignumber.js';
import { calculateFee } from './calculateFee';
import { plus } from '../utils/math';

const TREASURY_URL = 'https://fcd.terra.dev/treasury/';

const DEFAULT_DENOM = 'uusd';

interface SendTokenTransactionData {
	to: string;
	from: string;
	memo?: string;
	denom?: string;
	amount: string;
	contract?: string
	txDenom?: string;
}

const fetchCapital = async (denom = DEFAULT_DENOM) => {
	const { data: taxCapResult } = await axios.get(TREASURY_URL + `tax_cap/${denom}`);
	const taxCap = taxCapResult?.result;
	return taxCap;
}

const calculateTax = async (amount: string, denom = DEFAULT_DENOM) => {
	const { data: taxRateResult } = await axios.get(TREASURY_URL + 'tax_rate');
	const taxRate = taxRateResult?.result;
	const taxCap = denom === 'uluna' ? '0' : await fetchCapital(denom);
	const taxAmount = BigNumber.min(new BigNumber(amount).times(taxRate), new BigNumber(taxCap))
		.integerValue(BigNumber.ROUND_CEIL)
		.toString();
	return new Coin(denom, taxAmount)
}

const getGasPrice = async (denom = DEFAULT_DENOM) => {
	const { data } = await axios.get(FCD_URL + 'txs/gas_prices');
	return data?.[denom];
}



export const sendToken = async (data: SendTokenTransactionData, post) => {
	try {
		const { to, from, amount, memo, denom, txDenom, contract } = data;
		const amountInLamports = (+amount * +UNIT);
		const msgs = denom ? [new MsgSend(from, to, { [denom]: amountInLamports })] :  [
			new MsgExecuteContract(from, contract, {
			  transfer: { recipient: to, amount: amountInLamports.toString() },
			}),
		  ];
		const tax = denom ? await calculateTax(amountInLamports.toString(), denom) : null; 
		const feeDenom = txDenom ?? DEFAULT_DENOM;
		const gasPrice = await getGasPrice(feeDenom);
		const feeResult = await calculateFee(data.from, msgs, tax, gasPrice, feeDenom, memo);
		if (feeResult.error) {
			return feeResult;
		}
		else {
		  const gasPrices = { [txDenom]: gasPrice };
			const txOptions = {
				msgs,
				memo: memo,
				gasPrices,
				fee: feeResult.fee,
			}
			console.log(txOptions);
			const result = await post(txOptions);
			return result;
		}
	}
	catch ({ message }) {
		return { error: true, msg: message };
	}
}

export const simulateSendTokenTx = async (data: SendTokenTransactionData ) => {
    try{
	    const { to, from, amount, memo, denom, txDenom, contract } = data;
		const amountInLamports = (+amount * +UNIT);
		const msgs = denom ?  [new MsgSend(from, to, { [denom]: amountInLamports })] : [new MsgExecuteContract(from, contract, {
            transfer: { recipient: to, amount: amountInLamports.toString() },
        })]; 
		const feeDenom = txDenom ?? DEFAULT_DENOM;
		const gasPrice = await getGasPrice(feeDenom);
		const {estimatedFee}= await calculateFee(data.from, msgs, null, gasPrice, feeDenom, memo);
		const fee = (+estimatedFee / +UNIT).toString();
		return {fee, feeInLamports: estimatedFee, error: false};
    }
	catch(err){
		return {error: true, fee: '0', feeInLamports: '0'};
	}
}