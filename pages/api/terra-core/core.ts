import { LCDClient } from '@terra-money/terra.js';
import axios from "axios";
import { IS_TEST, TERRA_TEST_NET, TERRA_MAIN_NET } from '../../../constants';
import { fetchBlunaDetails } from './bluna';
import { plus, times, div } from "../mirror/utils";
import { UUSD_DENOM, LUNA_DENOM, DENOM_SYMBOLS } from "./symbols";

const DIVIDER = '1000000';

const FCD_URL = "https://fcd.terra.dev/v1/";

const terra = new LCDClient(IS_TEST ? TERRA_TEST_NET : TERRA_MAIN_NET);


export const getPrice = async (denom: string) => {
    try {
        const priceList = await axios.get(FCD_URL + `market/swaprate/${denom}`);
        const ussdPrice = priceList?.data.find(price => price.denom === UUSD_DENOM);
        return ussdPrice.swaprate;
    }
    catch (err) {
        throw new Error("Swaprate api not working for: " + denom);
    }
};

const getTerraTokens = async (coins, price: string) => {
    let assetsSum = '0';
    const tokens = [];
    if (coins) {
        for (const coin of coins) {
            const balance = div(coin.amount, DIVIDER);
            if (coin.denom === UUSD_DENOM) {
                assetsSum = plus(assetsSum, balance);
                tokens.push({ ...DENOM_SYMBOLS[coin.denom], price: '1', balance, value: balance });

            }
            else if (coin.denom === LUNA_DENOM) {
                const value = times(balance, price);
                assetsSum = plus(assetsSum, value);
                tokens.push({ ...DENOM_SYMBOLS[coin.denom], price, balance, value });
            }
            else if (DENOM_SYMBOLS[coin.denom]) {
                const price = await getPrice(coin.denom);
                const value = times(balance, price);
                assetsSum = plus(assetsSum, value);
                tokens.push({ ...DENOM_SYMBOLS[coin.denom], price: price, balance, value });
            };
        };
    }
    return { tokens, assetsSum };
}

const formatStakeData = (stakeData: any, price: string) => {
    let stakedSum = '0';
    if (stakeData?.myDelegations) {
        const staking = stakeData?.myDelegations.map((data: any) => {
            const balance = div(data?.amountDelegated, DIVIDER);
            const rewards = div(data?.totalReward, DIVIDER);
            const stakedValue = times(balance, price);
            const rewardsValue = times(rewards, price);
            const totalValue = plus(stakedValue, rewardsValue);
            stakedSum = plus(stakedSum, totalValue);
            return { balance, rewards, stakedValue, rewardsValue, totalValue, validator: data?.validatorName };
        });
        return { staking, stakedSum };
    }
    else return { staking: [], stakedSum };
}

export const getBankBalance = async ({ args: { address } }: any) => {
    const balanceRequest = terra.bank.balance(address);
    const pricesRequest = axios.get(FCD_URL + "dashboard");
    const stakingRequest = axios.get(FCD_URL + `staking/${address}`);
    const [balance, pricesData, stakeData] = await Promise.all([balanceRequest, pricesRequest, stakingRequest]);

    const coins = balance.toData();

    const lunaPrice = pricesData?.data?.prices[UUSD_DENOM];
    const getTerraRequest = getTerraTokens(coins, lunaPrice);
    const blunaHoldingRequest: any = fetchBlunaDetails(address, lunaPrice);
    const [terraTokens, blunaHoldings] = await Promise.all([getTerraRequest, blunaHoldingRequest]);
    const { tokens, assetsSum } = terraTokens;
    const assetsTotalSum = plus(parseFloat(assetsSum), parseFloat(blunaHoldings[0]?.value));
    const { staking, stakedSum } = formatStakeData(stakeData?.data, lunaPrice);
    return { address, core: { coins: [...tokens, ...blunaHoldings], staking, total: { assetsSum: assetsTotalSum.toString(), stakedSum } } };
};