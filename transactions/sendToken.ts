import axios from 'axios';
import { MsgSend, MsgExecuteContract} from "@terra-money/terra.js";
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
	const tax = BigNumber.min(new BigNumber(amount).times(taxRate), new BigNumber(taxCap))
		.integerValue(BigNumber.ROUND_CEIL)
		.toString();
	return tax;
}

const getGasPrice = async (denom = DEFAULT_DENOM) => {
	const { data } = await axios.get(FCD_URL + 'txs/gas_prices');
	return data?.[denom];
}



export const sendToken = async (data: SendTokenTransactionData, post) => {
	try {
		const { to, from, amount, memo, denom, contract } = data;
		const amountInLamports = (+amount * +UNIT);
		const msgs = denom ? [new MsgSend(from, to, { [denom]: amountInLamports })] :  [
			new MsgExecuteContract(from, contract, {
			  transfer: { recipient: to, amount: amountInLamports.toString() },
			}),
		  ];
		const tax = denom ? await calculateTax(amountInLamports.toString()) : '0'; 
		const feeDenom = denom ?? DEFAULT_DENOM;
		const gasPrice = await getGasPrice(feeDenom);
		const feeResult = await calculateFee(data.from, msgs, tax, gasPrice, feeDenom, memo);
		if (feeResult.error) {
			return feeResult;
		}
		else {
			const gasPrices = `${gasPrice}uusd`;
			const txOptions = {
				msgs,
				memo: memo,
				gasPrices,
				fee: feeResult.fee,
			}
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
	    const { to, from, amount, memo, denom, contract } = data;
		const amountInLamports = (+amount * +UNIT);
		const msgs = denom ?  [new MsgSend(from, to, { [denom]: amountInLamports })] : [new MsgExecuteContract(from, contract, {
            transfer: { recipient: to, amount: amountInLamports.toString() },
        })]; 
		const tax = denom ? await calculateTax(amountInLamports.toString(), denom) : '0';
		const feeDenom = denom ?? DEFAULT_DENOM;
		const gasPrice = await getGasPrice(feeDenom);
		const {estimatedFee} = await calculateFee(data.from, msgs, tax, gasPrice, feeDenom, memo);
		const feeInLamports = plus(estimatedFee, tax); 
		const fee = (+feeInLamports / +UNIT).toString();
		return {fee, feeInLamports, error: false};
    }
	catch(err){
		return {error: true, fee: '0', feeInLamports: '0'};
	}
}