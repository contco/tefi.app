import { LCDClient } from '@terra-money/terra.js';
import axios from "axios";
import { IS_TEST, TERRA_TEST_NET, TERRA_MAIN_NET } from '../../../constants';
import {plus, times, div} from "../mirror/utils";
import {UUSD_DENOM, LUNA_DENOM,DENOM_SYMBOLS} from "./symbols";

const DIVIDER = '1000000';

const FCD_URL = "https://fcd.terra.dev/v1/";

const terra = new LCDClient(IS_TEST ? TERRA_TEST_NET : TERRA_MAIN_NET);

const getTerraTokens  = (coins, price: string) => {
     let assetsSum = '0';
     const tokens = coins ? coins.map((coin:any) => {
     const balance =  div(coin.amount, DIVIDER);
    if(coin.denom === LUNA_DENOM) {
        const value = times(balance, price);
        assetsSum = plus(assetsSum, balance);
        return {...DENOM_SYMBOLS[coin.denom], price, balance, value };
    }
    else if (coin.denom === UUSD_DENOM) {
        assetsSum = plus(assetsSum, balance);
        return {...DENOM_SYMBOLS[coin.denom], price: '1', balance, value: balance};
    }
    //case not covered
    else {
        return {...DENOM_SYMBOLS[coin.denom], price: '0', balance, value: '0'}; 
    };
    })  : [];
    return {tokens, assetsSum};
}

const formatStakeData = (stakeData: any, price: string) => {
    let stakedSum = '0';
    if(stakeData?.myDelegations) {
    const staking = stakeData?.myDelegations.map((data: any) => {
      const balance = div(data?.amountDelegated, DIVIDER);  
      const rewards = div(data?.totalReward, DIVIDER);
      const stakedValue = times(balance, price);
      const rewardsValue = times(rewards, price);
      const totalValue= plus(stakedValue, rewardsValue);
      stakedSum = plus(stakedSum, totalValue);
      return {balance, rewards, stakedValue, rewardsValue, totalValue, validator: data?.validatorName};
    });
    return {staking, stakedSum};
    }
    else return {staking: [], stakedSum};
}

export const getBankBalance = async ({ args: { address } }: any) => {
    const balanceRequest= terra.bank.balance(address);
    const pricesRequest = axios.get(FCD_URL + "dashboard");
    const stakingRequest = axios.get(FCD_URL+ `staking/${address}`);
    const [balance, prices, stakeData] = await Promise.all([balanceRequest, pricesRequest, stakingRequest]);
    const coins = balance.toData();
    const lunaPrice = prices?.data?.prices[UUSD_DENOM];
    const {tokens, assetsSum} = getTerraTokens(coins, lunaPrice);
    const {staking, stakedSum} = formatStakeData(stakeData?.data, lunaPrice);
    return { address, core: { coins: tokens, staking, total: {assetsSum, stakedSum} }};
};