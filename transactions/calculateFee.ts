import {StdFee, MsgSend, MsgExecuteContract} from "@terra-money/terra.js";
import { simulateTx } from "./simulateTx";
import { plus} from "../utils/math";


export const calculateFee  = async (address: string, msgs: MsgSend[] | MsgExecuteContract[] , tax: string, gasPrice: string, denom: string, memo?: string) => {
  try {
    const {estimatedFee, gas} = await simulateTx(address, msgs, gasPrice, denom, memo);
    const fee = new StdFee(gas, { [denom]: plus(estimatedFee, tax)});
    return {fee, estimatedFee, gas};
  }
  catch(err){
    return {error: true, msg: 'Error calculating fee'};
  }

} 