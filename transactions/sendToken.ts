import axios from 'axios';
import {MsgSend} from "@terra-money/terra.js";
import { FCD_URL } from '../pages/api/utils';
import { UNIT } from '../pages/api/mirror/utils';
import BigNumber from 'bignumber.js';
import { calculateFee } from './calculateFee';

const TREASURY_URL = 'https://fcd.terra.dev/treasury/';

const DEFAULT_DENOM = 'uusd';

interface SendTokenTransactionData  {
    to: string;
	from: string; 
	memo?: string;
	denom?: string;
	amount: string;
	tokenContract?: string
}

const fetchCapital = async (denom = DEFAULT_DENOM ) => {
	const {data: taxCapResult} =  await axios.get(TREASURY_URL + `tax_cap/${denom}`);
	const taxCap = taxCapResult?.result;
	return taxCap;
}

const calculateTax = async (amount: string, denom = DEFAULT_DENOM ) => {
	const {data: taxRateResult}  = await axios.get(TREASURY_URL + 'tax_rate');
	const taxRate = taxRateResult?.result;
  const taxCap = denom === 'uluna' ? '0' : await fetchCapital(denom);
	const tax = BigNumber.min(new BigNumber(amount).times(taxRate), new BigNumber(taxCap))
	.integerValue(BigNumber.ROUND_CEIL)
	.toString();
	return tax;
}

const getGasPrice = async (denom = DEFAULT_DENOM) => {
	const {data}  = await axios.get(FCD_URL + 'txs/gas_prices');
	return data?.[denom];
}



export const sendNativeToken = async (data: SendTokenTransactionData, post) => {
  try {
		const {to, from, amount, memo, denom} = data;
		const amountInLamports = (+amount * +UNIT);	
    	const msgs =  [ new MsgSend(from, to, {[denom]: amountInLamports})]
    	const tax = await calculateTax(amountInLamports.toString());
		const gasPrice = await getGasPrice();
		const feeResult  = await calculateFee(data.from, msgs, tax, gasPrice, denom, memo);
		if(feeResult.error) {
			return feeResult;
		}
		else {
			const gasPrices =  `${gasPrice}uusd`;
			const txOptions = {
				msgs,
				memo: memo,
				gasPrices,
				fee: feeResult.fee,
			}
    		const result =  await post(txOptions);
			return result;
		}
    }
  catch(err){
		return {error: true, msg: 'Error Sending Native Token Transaction'};
  }
}
