import axios from "axios";
import { contracts } from "./contracts";
import { getLatestBlockHeight, LCD_URL } from "../../utils";
import { getFarmInfos } from "./farmInfo";
import { div, times } from "../../../../utils/math";


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
            pool: {}
          })
       },
    });
    
    return data?.result;
};


const getUserBalance = async (address: string) => {
    const {data} = await axios.get(LCD_URL + `wasm/contracts/${contracts.specToken}/store`, {
        params: {
          query_msg: JSON.stringify({
            balance: {
                address
            }
          })
       },
    });
    return data?.result?.balance ?? 0;
};

const getSpecPrice = (specPool) => {
    const price = div(specPool.assets[1].amount, specPool.assets[0].amount);
    return price;
};

const getHoldings = (balance, price) => {
  const value = times(balance, price);
  return [{name: 'Spectrum', symbol: 'SPEC',balance, price, value}]
}

export const getAccount =async (address: string) => {
 const height  = await getLatestBlockHeight();
 const userSpec = await getUserSpecInfo(address);
 const specPool = await getSpecPool();
 const specBalance= await getUserBalance(address);

 const specPrice =  getSpecPrice(specPool);

 const holdings = getHoldings(specBalance ,specPrice);
 console.log(holdings);

 // here balance = spec staked


 getFarmInfos(address, height, specPrice);

};