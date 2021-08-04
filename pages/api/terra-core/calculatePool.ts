import axios from "axios";
import { UNIT } from "../mirror/utils";
import { getLpValue } from "../utils";
import { times } from "../../../utils/math"
import pairs from './constants/pairs.json'
import tokens from './constants/mainnet-tokens.json';
import { UUSD_DENOM } from "./symbols";
const FCD_URL = "https://fcd.terra.dev/v1/";
import { getPrice, isLunaPair } from "../commons";
import { getTokenData } from "../spectrum/lib/coinInfos";

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

const getPoolSymbol = async (poolresponse, isLuna = false) => {
    let tokenContract = ''
    const liqContract = poolresponse.liquidity_token;
    let coinInfo;
    let symbol = ''
    pairs.map(pair => {
        if (pair.contract_addr === poolresponse.contract_addr) {
            pair.asset_infos.map(asset => {
                if (asset?.token) {
                    tokenContract = asset.token.contract_addr
                }
            })
        }
    });
    if (tokenContract && !isLuna) {
        coinInfo = await getTokenData(tokenContract)
        symbol = coinInfo?.symbol + '-UST'
    }
    else {
        if (liqContract) {
            tokens.map(token => {
                if (token.contract_addr === liqContract) {
                    symbol = token.symbol
                }
            })
        }
    }
    return symbol;
}

export const calculatePoolData = async (poolResponses, userPoolBalances) => {
    let total = 0;
    const pricesRequest = await axios.get(FCD_URL + "dashboard");
    const lunaPrice = pricesRequest?.data?.prices[UUSD_DENOM];

    const poolData = await Object.keys(poolResponses).map(async key => {
        const isLuna = isLunaPair(poolResponses[key]);
        const symbol = await getPoolSymbol(poolResponses[key], isLuna);
        let price = getPrice(poolResponses[key])
        if (isLuna) { price = times(price, lunaPrice); }
        const lpValue = getLpValue(poolResponses[key], parseFloat(price), isLuna, lunaPrice);
        const stakeableLP = parseFloat(userPoolBalances[key].balance) / UNIT;
        const poolValue = getPoolValues(stakeableLP, lpValue, parseFloat(price), isLuna, parseFloat(lunaPrice));
        const { stakeableLpUstValue } = poolValue;
        total = total + parseFloat(stakeableLpUstValue);
        return { price, stakeableLP: stakeableLP.toString(), ...poolValue, symbol };
    })
    return { list: poolData, total: total.toString() }
}

