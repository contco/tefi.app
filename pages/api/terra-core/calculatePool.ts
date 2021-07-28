import BigNumber from "bignumber.js";
import { UNIT } from "../mirror/utils";
import { getLpValue } from "../utils";
import { div } from "../../../utils/math"
import pairs from './constants/pairs.json'
import tokens from './constants/mainnet-tokens.json';

export const getPoolValues = (lpBalance: number, lpValue: number, price: number) => {
    const stakeableLpUstValue = lpBalance * lpValue;
    const ust = stakeableLpUstValue / 2;
    const token = ust / price;
    return { stakeableLpUstValue: stakeableLpUstValue.toString(), ust: ust.toString(), token: token.toString() };
}

export const getStakedTokenValue = (value, poolResponse) => {
    if (poolResponse.assets[0].info.native_token) {
        return new BigNumber(value)
            .times(poolResponse.assets[0].amount)
            .div(poolResponse.assets[1].amount)
            .toString();
    } else {
        return new BigNumber(value)
            .times(poolResponse.assets[1].amount)
            .div(poolResponse.assets[0].amount)
            .toString();
    }
}

export const getTokenPrice = (poolResponse) => {
    if (poolResponse.assets[0].info.native_token) {
        return div(poolResponse.assets[0].amount, poolResponse.assets[1].amount);
    } else {
        return div(poolResponse.assets[1].amount, poolResponse.assets[0].amount);
    }
}

export const calculatePoolData = async (poolResponses, userPoolBalances) => {
    let total = 0;
    const poolData = Object.keys(poolResponses).map(key => {
        const price = getTokenPrice(poolResponses[key])
        const lpValue = getLpValue(poolResponses[key], parseFloat(price));
        const stakeableLP = parseFloat(userPoolBalances[key].balance) / UNIT;
        const poolValue = getPoolValues(stakeableLP, lpValue, parseFloat(price));
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
        return { price, stakeableLP: stakeableLP.toString(), ...poolValue, symbol };
    })
    return { ...poolData, total: total.toString() }
}

