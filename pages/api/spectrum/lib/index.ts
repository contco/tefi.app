import { contracts } from "./contracts";
import { getFarmInfos } from "./farmInfo";
import { div, times } from "../../../../utils/math";
import { UNIT } from "../../mirror/utils";
import { wasmStoreRequest } from "../../commons";

const getUserSpecInfo = async (address) => {
  const userSpecInfoMsg = {
    balance: {
      address
    }
  };
   const data = await wasmStoreRequest(contracts.gov, userSpecInfoMsg);
   return data;
}

const getSpecPool = async () => {
  const specPoolMsg = { 
    pool: {}
  };
  const data = await wasmStoreRequest(contracts.specPool, specPoolMsg);
  return data;
};


const getUserBalance = async (address: string) => {
    const userBalanceMsg = {
      balance: {
        address
      }
    };
    const data = await wasmStoreRequest(contracts.specToken, userBalanceMsg);
    return data?.balance ?? '0';
};

const getSpecPrice = (specPool) => {
    const price = div(specPool.assets[1].amount, specPool.assets[0].amount);
    return price;
};

const getSpecGov = (userSpec, specPrice, govApr) => {
  if(userSpec && userSpec?.balance !== '0') {
    const name = "SPEC Gov";
    const symbol = "SPEC";
    const staked = (parseFloat(userSpec?.balance)/ UNIT).toString();
    const value =  times(staked, specPrice);
    const apr = times(govApr, '100');
    return {name, symbol, staked, value, apr, rewards: "Automatically re-staked", price: specPrice};
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
  const farmDataPromise =  getFarmInfos(address);
  const result  = await Promise.all([userSpecPromise, specPoolPromise, specBalancePromise, farmDataPromise]);
  return result;
}

export const getAccount = async (address: string) => {
  const [userSpec, specPool, specBalance, farmData] = await fetchData(address);
  const specPrice =  specPool ? getSpecPrice(specPool) : '0';

  const {farms, farmsTotal,rewardsTotal, govApr} = farmData;
  const holdings = getHoldings(specBalance ,specPrice);
  const specGov = getSpecGov(userSpec, specPrice, govApr)
  const holdingsTotal = specBalance === '0' ? '0' : holdings[0].value;
  const spectrumTotal = {farmsTotal, holdingsTotal: holdingsTotal, rewardsTotal }
  return {farms, specHoldings: holdings, specGov, spectrumTotal};
};