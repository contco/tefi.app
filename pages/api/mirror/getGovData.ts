import axios from "axios";
import { mirrorContracts } from "./mirrorContracts";
import { UNIT, times, MIR } from "./utils";
import { LCD_URL } from "../utils";

export const fetchGovBalance = async (address: string) => {
  try {
    const {data} = await axios.get(LCD_URL + `wasm/contracts/${mirrorContracts.gov}/store`, {
        params: {
          query_msg: JSON.stringify({
            staker: {
                address
            }
          })
       },
    });
    return data?.result?.balance ?? "0";
  }
  catch(err){
    return '0';
  }
};

export const getGovData = (balance: string, statistic: any) => {
  if(balance === "0") {
      return null;
  }
  else {
      const price = statistic?.mirPrice ?? '0';
      const govApr = statistic?.govAPR ?? '0';
      const name = "MIR Gov"; 
      const symbol = MIR;
      const staked = (parseFloat(balance)/ UNIT).toString();
      const value =  times(staked, price);
      const apr = times(govApr, '100');
      return {name, symbol, staked, value, apr, price, rewards: "Automatically re-staked"};
  }
}