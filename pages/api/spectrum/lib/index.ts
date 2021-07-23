import axios from "axios";
import { contracts } from "./contracts";
import { getLatestBlockHeight, LCD_URL } from "../../utils";
import { getFarmInfos } from "./farmInfo";
import { div, times } from "../../../../utils/math";
import { UNIT } from "../../mirror/utils";


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

const getSpecGov = (userSpec, specPrice, govApr) => {
  if(userSpec.balance !== '0') {
    const name = "SPEC Gov";
    const staked = (parseFloat(userSpec?.balance)/ UNIT).toString();
    const value =  times(staked, specPrice);
    const apr = times(govApr, '100');
    return {name, staked, value, apr, rewards: "N/A", price: specPrice};
  }
  else return null;
}
const getHoldings = (balance, price) => {
  if (balance !== '0') {
    const specBalance = (parseFloat(balance) / UNIT).toString(); 
    const value = times(specBalance, price);
    return [{name: 'Spectrum', symbol: 'SPEC',balance: specBalance, price, value}]
  }
  return [];
}

const fetchData = async (address: string) => {
  const userSpecPromise =  getUserSpecInfo(address);
  const specPoolPromise =  getSpecPool();
  const specBalancePromise =  getUserBalance(address);
  const result  = await Promise.all([userSpecPromise, specPoolPromise, specBalancePromise]);
  return result;
}

export const getAccount = async (address: string) => {
  const height  = await getLatestBlockHeight();
  const [userSpec, specPool, specBalance] = await fetchData(address);
  const specPrice =  getSpecPrice(specPool);

  const {farms, farmsTotal, govApr} = await getFarmInfos(address, height, specPrice);
  const holdings = getHoldings(specBalance ,specPrice);
  const specGov = getSpecGov(userSpec, specPrice, govApr)
  const holdingsTotal = specBalance === '0' ? '0' : holdings[0].value;
  const spectrumTotal = {farmsTotal, holdingsTotal: holdingsTotal}
  return {farms, specHoldings: holdings, specGov, spectrumTotal};
};