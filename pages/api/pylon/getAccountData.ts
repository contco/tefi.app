import axios from "axios";
import {PYLON_API_ENDPOINT, PYLON_TOKEN_NAME, PYLON_TOKEN_SYMBOL, PYLON_UST_LP} from "./constants";
import { getGatewayData } from "./getGatewayData";

const fetchPylonData = async (address: string) => {
    const mineOverviewPromise = axios.get(PYLON_API_ENDPOINT + 'mine/v1/overview');  
    const governanceOverviewPromise = axios.get(PYLON_API_ENDPOINT + 'governance/v1/overview');   
    const poolOverViewPromise = axios.get(PYLON_API_ENDPOINT + 'liquidity/v1/overview');    
    const getAccountDetailsPromise = axios.get(PYLON_API_ENDPOINT + `account/v1/${address}`);
    const mineStakingPromise = axios.get(PYLON_API_ENDPOINT + `governance/v1/status/${address}`);
    const minePoolPromise = axios.get(PYLON_API_ENDPOINT + `liquidity/v1/status/${address}`);
    const airdropPromise = axios.get(PYLON_API_ENDPOINT + `mine/v1/airdrop/${address}`);
    const gatewayDataPromise = getGatewayData(address);
    const result = await Promise.all([mineOverviewPromise, getAccountDetailsPromise, mineStakingPromise, minePoolPromise,governanceOverviewPromise, poolOverViewPromise,airdropPromise, gatewayDataPromise]);
    return result;
}

const getPylonHoldings = (price: number, accountDetails: any) => {
    const {mineBalance} = accountDetails?.data;

    if (mineBalance) {
        const value = (mineBalance * price).toString();
        return {pylonHoldingsSum: value.toString(), pylonHoldings: [{symbol: PYLON_TOKEN_SYMBOL, name: PYLON_TOKEN_NAME, balance: mineBalance.toString(), value, price: price.toString()}]};
    }
    return {pylonHoldingsSum: '0', pylonHoldings: []};
};

const getPylonStakings = (price: number, mineStakingData:any, apy: number) => {
    if (mineStakingData?.data) {
       const {stakedBalance, earned} = mineStakingData?.data;
       if(stakedBalance !== 0) {
           const stakedValue = (stakedBalance * price).toString();
           const rewardsValue = (earned * price).toString();
           const totalValue = (rewardsValue + stakedValue).toString();
           const pylonStakings =  [{symbol: PYLON_TOKEN_SYMBOL, name: PYLON_TOKEN_NAME, balance: stakedBalance.toString(), rewards: earned.toString(), stakedValue, rewardsValue ,totalValue, apy: apy?.toString() ?? '0'}];
           return {pylonStakingSum: totalValue, pylonStakingRewardsSum: rewardsValue, pylonStakings};
       }
    }
    return {pylonStakingSum: '0',pylonStakingRewardsSum: '0', pylonStakings: []};
};

const getMinePoolInfo = (price: number, minePoolData, apy: number, lpValue: number) => {
   if(minePoolData?.data) {
       const {balance, earned, stakedBalance} = minePoolData.data;
      if(stakedBalance || balance) {
        const stakedLpUstValue = (stakedBalance * lpValue);
        const availableLpUstValue = (balance * lpValue) ?? 0;
        const ustStaked = stakedLpUstValue / 2;
        const ustUnStaked = availableLpUstValue/ 2;
        const tokenStaked = ustStaked / price;
        const tokenUnStaked = ustUnStaked  / price; 
        const rewardsValue = (price * earned).toString();
        const pylonPool = [{symbol: PYLON_TOKEN_SYMBOL , lpName: PYLON_UST_LP, availableLP: balance.toString(), stakedLP: stakedBalance.toString(), rewards: earned.toString(), rewardsValue, apy: apy?.toString() ?? '0', stakedLpUstValue: stakedLpUstValue.toString(),availableLpUstValue: availableLpUstValue.toString(), ustStaked: ustStaked.toString(),ustUnStaked: ustUnStaked.toString(), tokenStaked: tokenStaked.toString(), tokenUnStaked: tokenUnStaked.toString()}];
        const pylonPoolSum = (stakedLpUstValue + availableLpUstValue).toString();
        const pylonPoolRewardsSum = rewardsValue?.toString() ?? '0';
        return {pylonPoolSum, pylonPoolRewardsSum, pylonPool}
      }
   }
   return {pylonPoolSum: '0', pylonPoolRewardsSum: '0', pylonPool: []};
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

const getLpValue = (liquidityInfo: any,  minePrice: number) => {
   const {tokenReserve, ustReserve, totalShares} = liquidityInfo;
   const totalLpValue = (tokenReserve * minePrice) + ustReserve;
   const lpValue = totalLpValue / totalShares;
   return lpValue;
}

export const getAccountData = async (address: string) => {  
    try {
        const [mineOverview, getAccountDetails, mineStakingData, minePoolData, governanceOverview, liquidityOverview, airdropData, pylonGateway] = await fetchPylonData(address);
        const {priceInUst} = mineOverview.data;
        const lpValue = getLpValue(mineOverview?.data?.liquidityInfo, priceInUst);
        const {pylonHoldingsSum , pylonHoldings} = getPylonHoldings(priceInUst, getAccountDetails);
        const {pylonStakingSum,pylonStakingRewardsSum, pylonStakings} = getPylonStakings(priceInUst, mineStakingData, governanceOverview?.data?.apy);
        const {pylonPoolSum,pylonPoolRewardsSum, pylonPool} = getMinePoolInfo(priceInUst, minePoolData, liquidityOverview?.data?.apy, lpValue);
        const {pylonAirdropSum, pylonAirdrops} = getPylonAirdrops(priceInUst, airdropData?.data);
        const pylonTotal = {pylonHoldingsSum, pylonStakingSum, pylonPoolSum, pylonAirdropSum, pylonPoolRewardsSum, pylonStakingRewardsSum};

        return {pylonHoldings, pylonStakings, pylonPool, pylonAirdrops, pylonSum: pylonTotal, pylonGateway};
    }
    catch(err) {
      throw new Error("Error Fetching Pylon Data");
    }
};
