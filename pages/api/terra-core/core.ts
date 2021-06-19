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
     const amount =  div(coin.amount, DIVIDER);
    if(coin.denom === LUNA_DENOM) {
        const balance = times(amount, price);
        assetsSum = plus(assetsSum, balance);
        return {...DENOM_SYMBOLS[coin.denom], price, amount, balance };
    }
    else if (coin.denom === UUSD_DENOM) {
        assetsSum = plus(assetsSum, amount);
        return {...DENOM_SYMBOLS[coin.denom], price: '1', amount, balance: amount};
    }
    //case not covered
    else {
        return {...DENOM_SYMBOLS[coin.denom], price: '0', amount, balance: '0'}; 
    };
    })  : [];
    return {tokens, assetsSum};
}

export const getBankBalance = async ({ args: { address } }: any) => {
    const balanceRequest= terra.bank.balance(address);
    const pricesRequest = axios.get(FCD_URL + "dashboard");
    const [balance, prices] = await Promise.all([balanceRequest, pricesRequest]);
    const coins = balance.toData();
    const lunaPrice = prices?.data?.prices[UUSD_DENOM];
    const {tokens, assetsSum} = getTerraTokens(coins, lunaPrice);
    return { address, core: { coins: tokens, total: {assetsSum} }};
};