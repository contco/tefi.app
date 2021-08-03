import axios from "axios";
import BigNumber from "bignumber.js";
import { UNIT } from "../mirror/utils";
import { getLpValue } from "../utils";
import { div, gt, times, ceil, plus, minus } from "../../../utils/math"
import pairs from './constants/pairs.json'
import tokens from './constants/mainnet-tokens.json';
import { tokenInfos } from "./constants/constants";
import { UUSD_DENOM, LUNA_DENOM } from "./symbols";
const FCD_URL = "https://fcd.terra.dev/v1/";

export const getPoolValues = (lpBalance: number, lpValue: number, price: number, poolResponse) => {
    const stakeableLpUstValue = lpBalance * lpValue;

    let ust = 0;
    if (!(poolResponse.assets[0].info.native_token && poolResponse.assets[1].info.native_token)) {
        ust = stakeableLpUstValue / 2;
    }
    else {
        ust = stakeableLpUstValue;
    }
    const token = ust / price;
    return { stakeableLpUstValue: stakeableLpUstValue.toString(), ust: ust.toString(), token: token.toString() };
}


export const getTokenPrice = (poolResponse, lunaUstPrice) => {
    if (!(poolResponse.assets[0].info.native_token && poolResponse.assets[1].info.native_token)) {
        if (poolResponse.assets[0].info.native_token) {
            return div(poolResponse.assets[0].amount, poolResponse.assets[1].amount);
        } else {
            return div(poolResponse.assets[1].amount, poolResponse.assets[0].amount);
        }
    }
    else {
        let priceInLuna;
        if (poolResponse.assets[0].info.native_token.denom === LUNA_DENOM) {
            priceInLuna = div(poolResponse.assets[1].amount, poolResponse.assets[0].amount)
            return times(priceInLuna, lunaUstPrice)
        } else {
            priceInLuna = div(poolResponse.assets[0].amount, poolResponse.assets[1].amount)
            return times(priceInLuna, lunaUstPrice);
        }
    }
}

export const calculatePoolData = async (poolResponses, userPoolBalances) => {
    let total = 0;
    const pricesRequest = await axios.get(FCD_URL + "dashboard");
    const lunaPrice = pricesRequest?.data?.prices[UUSD_DENOM];

    const poolData = Object.keys(poolResponses).map(key => {
        const price = getTokenPrice(poolResponses[key], lunaPrice)
        const lpValue = getLpValue(poolResponses[key], parseFloat(price));
        const stakeableLP = parseFloat(userPoolBalances[key].balance) / UNIT;
        const poolValue = getPoolValues(stakeableLP, lpValue, parseFloat(price), poolResponses[key]);
        const { stakeableLpUstValue } = poolValue;
        total = total + parseFloat(stakeableLpUstValue);

        let symbol = ''
        if (userPoolBalances[key].contract_addr === pairs[key].contract_addr) {
            pairs[key].asset_infos.map(a => {
                tokens.map(token => {
                    if (token.contract_addr = a['token']) {
                        symbol = token.symbol
                    }
                })
            })
        }
        console.log('poolResponses', poolResponses)
        return { price, stakeableLP: stakeableLP.toString(), ...poolValue, symbol };
    })
    return { ...poolData, total: total.toString() }
}

