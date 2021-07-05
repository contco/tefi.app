import axios from "axios";
const PYLON_API_ENDPOINT = "https://api.pylon.money/api/";
const PYLON_TOKEN_SYMBOL = "MINE";
const PYLON_TOKEN_NAME = "Pylon MINE Token";

const getMineHoldings = (price: number, accountDetails: any) => {
    const {mineBalance} = accountDetails?.data;
    const value = (mineBalance * price).toString();
    return [{symbol: PYLON_TOKEN_SYMBOL, name: PYLON_TOKEN_NAME, balance: mineBalance.toString(), value, price: price.toString()}];
};

const getMineStakings = (price: number, mineStakingData:any) => {
    if (mineStakingData?.data) {
       const {stakedBalance, earned} = mineStakingData?.data;
       if(stakedBalance !== 0) {
           const stakedValue = (stakedBalance * price).toString();
           const rewardsValue = (earned * price).toString();
           const totalValue = (rewardsValue + stakedValue).toString();
           return [{symbol: PYLON_TOKEN_SYMBOL, name: PYLON_TOKEN_NAME, balance: stakedBalance.toString(), rewards: earned.toString(), stakedValue, rewardsValue ,totalValue, apy: '0'}]
       }
    }
    return null;
};

const getMinePoolInfo = (price: number, minePoolData) => {
   if(minePoolData?.data) {
       const {balance, earned, stakedBalance} = minePoolData.data;
      if(stakedBalance || balance) {
        const rewardsValue = (price * earned).toString();
        return {symbol: PYLON_TOKEN_SYMBOL, availableLP: balance.toString(), stakedLP: stakedBalance.toString(), rewards: earned.toString(), rewardsValue, apy:'0'}
      }
   }
   return null;
};

export const getAccountData = async (address: string) => {

 const mineOverviewPromise = axios.get(PYLON_API_ENDPOINT + 'mine/v1/overview');   
 const getAccountDetailsPromise = axios.get(PYLON_API_ENDPOINT + `account/v1/${address}`);
 const mineStakingPromise = axios.get(PYLON_API_ENDPOINT + `governance/v1/status/${address}`);
 const minePoolPromise = axios.get(PYLON_API_ENDPOINT + `liquidity/v1/status/${address}`);
 const [mineOverview, getAccountDetails, mineStakingData, minePoolData] = await Promise.all([mineOverviewPromise, getAccountDetailsPromise, mineStakingPromise, minePoolPromise]);
 const {priceInUst} = mineOverview.data;
 const mineHoldings = getMineHoldings(priceInUst, getAccountDetails);
 const mineStakings = getMineStakings(priceInUst, mineStakingData);
 const minePool = getMinePoolInfo(priceInUst, minePoolData)
 return {mineHoldings, mineStakings, minePool}

};
