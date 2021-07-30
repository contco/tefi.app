import BigNumber from "bignumber.js";
import { UNIT } from "../mirror/utils";
import { getLpValue } from "../utils";
import { div, gt, times, ceil, plus, minus } from "../../../utils/math"
import pairs from './constants/pairs.json'
import tokens from './constants/mainnet-tokens.json';
import { tokenInfos } from "./constants/constants";

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


export function isAssetInfo(object: any): object is AssetInfo {
    return "token" in object
}

export const getTokenPrice = (res) => {
    // if (poolResponse.assets[0].info.native_token) {
    //     return div(poolResponse.assets[0].amount, poolResponse.assets[1].amount);
    // } else {
    //     return div(poolResponse.assets[1].amount, poolResponse.assets[0].amount);
    // }

    let fromValue = "0"
    let toValue = "0"

    if (isAssetInfo(res.assets[1].info)) {
        if (
            tokenInfos.get(res.assets[1].info.token.contract_addr)
                ?.symbol === symbol
        ) {
            fromValue = res.assets[1].amount
            toValue = res.assets[0].amount
        } else {
            fromValue = res.assets[0].amount
            toValue = res.assets[1].amount
        }
    } else {
        if (
            tokenInfos.get(res.assets[1].info.native_token.denom)
                ?.symbol === symbol
        ) {
            fromValue = res.assets[1].amount
            toValue = res.assets[0].amount
        } else {
            fromValue = res.assets[0].amount
            toValue = res.assets[1].amount
        }
    }

    const calculatedAmount = toAmount(amount)

    const rate1 = res ? div(fromValue, res.total_share) : "0"
    const rate2 = res ? div(toValue, res.total_share) : "0"

    let price1 = "0"
    let price2 = "0"
    let estimated = "0"
    let LP = "0"
    let afterPool = "0"
    if (type === Type.WITHDRAW) {
        // withdraw
        LP = calculatedAmount
        estimated =
            res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? ceil(times(rate1, LP)) + "-" + ceil(times(rate2, LP))
                : "0"
        price1 =
            res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? div(times(rate1, LP), LP)
                : "0"
        price2 =
            res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? div(times(rate2, LP), LP)
                : "0"
        LP = minus(balance, calculatedAmount)
        afterPool =
            res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? div(LP, plus(res.total_share, LP))
                : "0"
    } else {
        // provide
        LP =
            res && gt(calculatedAmount, 0)
                ? div(calculatedAmount, rate1)
                : "0"
        estimated =
            res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? ceil(times(LP, rate2))
                : "0"
        price1 =
            res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? div(calculatedAmount, LP)
                : "0"
        price2 =
            res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? div(estimated, LP)
                : "0"
        afterPool =
            res && gt(res.total_share, 0) && gt(calculatedAmount, 0)
                ? div(LP, plus(LP, res.total_share))
                : "0"
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

