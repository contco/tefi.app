import axios from "axios";
import { math, MICRO } from "@contco/terra-utilities";
import { mirrorContracts } from "./mirrorContracts";
import { MIR } from "./utils";
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
      const staked = (parseFloat(balance)/ MICRO).toString();
      const value =  math.times(staked, price);
      const apr = math.times(govApr, '100');
      return {name, symbol, staked, value, apr, price, rewards: "Automatically re-staked"};
  }
}