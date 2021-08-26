import {StdFee, Msg} from "@terra-money/terra.js";
import { simulateTx } from "./simulateTx";
import { plus} from "../utils/math";


export const calculateFee  = async (address: string, msgs: Msg[], tax: string, gasPrice: string, memo?: string) => {
  try {
    const {estimatedFee, gas} = await simulateTx(address, msgs, gasPrice, memo);
    const fee = new StdFee(gas, { uusd: plus(estimatedFee, tax)});
    return {fee, estimatedFee, gas};
  }
  catch(err){
    return {error: true, msg: 'Error calculating fee'};
  }

} 