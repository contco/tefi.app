import axios from "axios";
import { mirrorContracts } from "./mirrorContracts";
import { UNIT, times, MIR } from "./utils";
import { LCD_URL } from "../utils";

export const fetchGovBalance = async (address: string) => {
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
};

export const getGovData = (balance: string, statistic: any) => {
  if(balance === "0") {
      return null;
  }
  else {
      const name = "MIR Gov"; 
      const symbol = MIR;
      const staked = (parseFloat(balance)/ UNIT).toString();
      const value =  times(staked, statistic?.mirPrice);
      const apr = times(statistic?.govAPR, '100');
      return {name, symbol, staked, value, apr, price: statistic?.mirPrice, rewards: "Automatically re-staked"};
  }
}