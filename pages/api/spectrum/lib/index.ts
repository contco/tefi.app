import axios from "axios";
import { contracts } from "./contracts";
import { getLatestBlockHeight, LCD_URL } from "../../utils";
import { getFarmInfos } from "./farmInfo";

export const getAccount =async (address: string) => {
 const height  = await getLatestBlockHeight();

 // here balance = spec staked
 const result = await axios.get(LCD_URL + `wasm/contracts/${contracts.gov}/store`, {
     params: {
       query_msg: JSON.stringify({
         balance: {
           address: address,
         }
       })
    },
 });

 getFarmInfos();

};