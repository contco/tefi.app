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

const getSpecGov = (userSpec, specPrice, govApr) => {
  if(userSpec.balance !== '0') {
    const name = "SPEC Gov";
    const staked = userSpec?.balance;
    const value =  times(staked, specPrice);
    return {name, staked, value, apr: govApr, rewards: null, price: specPrice};
  }
  else return null;
}
const getHoldings = (balance, price) => {
  if (balance !== '0') {
    const value = times(balance, price);
    return [{name: 'Spectrum', symbol: 'SPEC',balance, price, value}]
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

  const {farms, govApr} = await getFarmInfos(address, height, specPrice);
  const holdings = getHoldings(specBalance ,specPrice);
  const specGov = getSpecGov(userSpec, specPrice, govApr)

  return {farms, specHoldings: holdings, specGov};
};