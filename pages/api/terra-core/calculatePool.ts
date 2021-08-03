import axios from "axios";
import { UNIT } from "../mirror/utils";
import { getLpValue } from "../utils";
import { times } from "../../../utils/math"
import pairs from './constants/pairs.json'
import tokens from './constants/mainnet-tokens.json';
import { UUSD_DENOM } from "./symbols";
const FCD_URL = "https://fcd.terra.dev/v1/";
import { getPrice, isLunaPair } from "../commons";

export const getPoolValues = (lpBalance: number, lpValue: number, price: number, isLuna = false, lunaPrice?: number) => {
    let ust, luna = null
    const stakeableLpUstValue = lpBalance * lpValue;
    const tokenValueInUST = stakeableLpUstValue / 2;
    if (isLuna) {
        luna = (tokenValueInUST / lunaPrice).toString();
    }
    else {
        ust = tokenValueInUST.toString()
    }
    const token = tokenValueInUST / price;
    return { stakeableLpUstValue: stakeableLpUstValue.toString(), ust, luna, token: token.toString() };
}

export const calculatePoolData = async (poolResponses, userPoolBalances) => {
    let total = 0;
    const pricesRequest = await axios.get(FCD_URL + "dashboard");
    const lunaPrice = pricesRequest?.data?.prices[UUSD_DENOM];

    const poolData = Object.keys(poolResponses).map(key => {
        let price = getPrice(poolResponses[key])
        const isLuna = isLunaPair(poolResponses[key]);
        if (isLuna) {
            price = times(price, lunaPrice);
        }
        const lpValue = getLpValue(poolResponses[key], parseFloat(price), isLuna, lunaPrice);
        const stakeableLP = parseFloat(userPoolBalances[key].balance) / UNIT;
        const poolValue = getPoolValues(stakeableLP, lpValue, parseFloat(price), isLuna, parseFloat(lunaPrice));
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
    return { list: poolData, total: total.toString() }
}

