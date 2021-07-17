import axios from "axios";
import { contracts } from "./contracts";
import { getLatestBlockHeight, LCD_URL } from "../../utils";
import { getFarmInfos } from "./farmInfo";
import { div } from "../../../../utils/math";


const getUserSpecInfo = async (address) => {
    const {data} = await axios.get(LCD_URL + `wasm/contracts/${contracts.gov}/store`, {
        params: {
          query_msg: JSON.stringify({
            balance: {
              address: address,
            }
          })
       },
    });
    
    return data?.result;
}

const getSpecPool = async () => {
    const {data} = await axios.get(LCD_URL + `wasm/contracts/${contracts.specPool}/store`, {
        params: {
          query_msg: JSON.stringify({
            pool: {
            }
          })
       },
    });
    
    return data?.result;
};

const getSpecPrice = (specPool) => {
    const price = div(specPool.assets[1].amount, specPool.assets[0].amount);
    return price;
}

export const getAccount =async (address: string) => {
 const height  = await getLatestBlockHeight();
 const userSpec = await getUserSpecInfo(address);
 const specPool = await getSpecPool();
 const specPrice = getSpecPrice(specPool);
 // here balance = spec staked


 getFarmInfos(height, specPrice);

};