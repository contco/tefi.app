import axios from "axios";
const PYLON_API_ENDPOINT = "https://api.pylon.money/api/";
const PYLON_TOKEN_SYMBOL = "MINE";
const PYLON_TOKEN_NAME = "Pylon MINE Token";
const PYLON_UST_LP = "MINE-UST LP";


const fetchPylonData = async (address: string) => {
    const mineOverviewPromise = axios.get(PYLON_API_ENDPOINT + 'mine/v1/overview');  
    const governanceOverviewPromise = axios.get(PYLON_API_ENDPOINT + 'governance/v1/overview');   
    const poolOverViewPromise = axios.get(PYLON_API_ENDPOINT + 'liquidity/v1/overview');    
    const getAccountDetailsPromise = axios.get(PYLON_API_ENDPOINT + `account/v1/${address}`);
    const mineStakingPromise = axios.get(PYLON_API_ENDPOINT + `governance/v1/status/${address}`);
    const minePoolPromise = axios.get(PYLON_API_ENDPOINT + `liquidity/v1/status/${address}`);
    const airdropPromise = axios.get(PYLON_API_ENDPOINT + `mine/v1/airdrop/${address}`);
    const result = await Promise.all([mineOverviewPromise, getAccountDetailsPromise, mineStakingPromise, minePoolPromise,governanceOverviewPromise, poolOverViewPromise,airdropPromise]);
    return result;
}

const getPylonHoldings = (price: number, accountDetails: any) => {
    const {mineBalance} = accountDetails?.data;

    if (mineBalance) {
        const value = (mineBalance * price).toString();
        return {pylonHoldingsSum: value.toString(), pylonHoldings: [{symbol: PYLON_TOKEN_SYMBOL, name: PYLON_TOKEN_NAME, balance: mineBalance.toString(), value, price: price.toString()}]};
    }
    return {pylonHoldingsSum: '0', pylonHoldings: null};
};

const getPylonStakings = (price: number, mineStakingData:any, apy: number) => {
    if (mineStakingData?.data) {
       const {stakedBalance, earned} = mineStakingData?.data;
       if(stakedBalance !== 0) {
           const stakedValue = (stakedBalance * price).toString();
           const rewardsValue = (earned * price).toString();
           const totalValue = (rewardsValue + stakedValue).toString();
           const pylonStakings =  [{symbol: PYLON_TOKEN_SYMBOL, name: PYLON_TOKEN_NAME, balance: stakedBalance.toString(), rewards: earned.toString(), stakedValue, rewardsValue ,totalValue, apy: apy?.toString() ?? '0'}];
           return {pylonStakingSum: totalValue, pylonStakings};
       }
    }
    return {pylonStakingSum: '0', pylonStakings: null};
};

const getMinePoolInfo = (price: number, minePoolData, apy: number) => {
   if(minePoolData?.data) {
       const {balance, earned, stakedBalance} = minePoolData.data;
      if(stakedBalance || balance) {
        const rewardsValue = (price * earned).toString();
        const pylonPool = [{symbol: PYLON_TOKEN_SYMBOL , lpName: PYLON_UST_LP, availableLP: balance.toString(), stakedLP: stakedBalance.toString(), rewards: earned.toString(), rewardsValue, apy: apy?.toString() ?? '0'}];
        const pylonPoolSum = rewardsValue;
        return {pylonPoolSum, pylonPool}
      }
   }
   return {pylonPoolSum: '0', pylonPool: null};
};

const getPylonAirdrops = (price: number, data: any) => {
    const {amount} = data;
    if (amount) {
      const value = (amount * price).toString();
      const pylonAirdrops = {name: PYLON_TOKEN_SYMBOL, quantity: amount.toString(), price: value};
      return {pylonAirdropSum: value, pylonAirdrops};
    }
    return {pylonAirdropSum: '0', pylonAirdrops: undefined};
}

export const getAccountData = async (address: string) => {  
    try {
        const [mineOverview, getAccountDetails, mineStakingData, minePoolData, governanceOverview, liquidityOverview, airdropData] = await fetchPylonData(address);
        const {priceInUst} = mineOverview.data;
        const {pylonHoldingsSum , pylonHoldings} = getPylonHoldings(priceInUst, getAccountDetails);
        const {pylonStakingSum, pylonStakings} = getPylonStakings(priceInUst, mineStakingData, governanceOverview?.data?.apy);
        const {pylonPoolSum, pylonPool} = getMinePoolInfo(priceInUst, minePoolData, liquidityOverview?.data?.apy);
        const {pylonAirdropSum, pylonAirdrops} = getPylonAirdrops(priceInUst, airdropData?.data);
        const pylonTotal = {pylonHoldingsSum, pylonStakingSum, pylonPoolSum, pylonAirdropSum};
        return {pylonHoldings, pylonStakings, pylonPool,pylonAirdrops, pylonPoolSum: pylonTotal};
    }
    catch(err) {
      throw new Error("Error Fetching Pylon Data");
    }
};
