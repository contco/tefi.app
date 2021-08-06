import axios from "axios";
import { UNIT } from "../mirror/utils";
import { getLpValue } from "../utils";
import { times, plus } from "../../../utils/math"
import pairs from './constants/pairs.json'
import tokens from './constants/mainnet-tokens.json';
import { UUSD_DENOM } from "./symbols";
const FCD_URL = "https://fcd.terra.dev/v1/";
import { getPrice, isLunaPair } from "../commons";
import { getTokenData } from "../spectrum/lib/coinInfos";

export const getPoolValues = (lpBalance: number, lpValue: number, price: number, isLuna = false, lunaPrice?: number) => {
    let token1UnStaked = null
    let token1Staked = "0", token2Staked = "0", stakedLpUstValue = "0";
    const stakeableLpUstValue = lpBalance * lpValue;
    const totalLpUstValue = (stakeableLpUstValue).toString();

    const tokenValueInUST = stakeableLpUstValue / 2;
    if (isLuna) {
        token1UnStaked = (tokenValueInUST / lunaPrice).toString();
    }
    else {
        token1UnStaked = tokenValueInUST.toString()
    }
    const token2UnStaked = tokenValueInUST / price;
    return { stakedLpUstValue, stakeableLpUstValue: stakeableLpUstValue.toString(), totalLpUstValue, token1UnStaked, token1Staked, token2UnStaked: token2UnStaked.toString(), token2Staked };
}

const getPoolSymbol = async (poolresponse, isLuna = false) => {
    let tokenContract = ''
    let coinInfo;
    let symbol1 = ''
    let symbol2 = ''
    let lpName = ''
    const liqContract = poolresponse.liquidity_token;

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
        lpName = coinInfo?.symbol + '-UST LP';
        symbol1 = 'UST'
        symbol2 = coinInfo?.symbol;
    }
    else {
        if (liqContract) {
            tokens.map(token => {
                if (token.contract_addr === liqContract) {
                    lpName = token.symbol + '-LUNA LP';
                    symbol1 = 'LUNA'
                    symbol2 = token.symbol;
                }
            })
        }
    }
    return { symbol1, symbol2, lpName };
}

export const calculatePoolData = async (poolResponses, userPoolBalances) => {
    let poolsData = [];
    let total = 0;
    const pricesRequest = await axios.get(FCD_URL + "dashboard");
    const lunaPrice = pricesRequest?.data?.prices[UUSD_DENOM];

    const poolTask = Object.keys(poolResponses).map(async key => {
        const isLuna = isLunaPair(poolResponses[key]);
        const { symbol1, symbol2, lpName } = await getPoolSymbol(poolResponses[key], isLuna);
        let price = getPrice(poolResponses[key])
        if (isLuna) { price = times(price, lunaPrice); }
        const lpValue = getLpValue(poolResponses[key], parseFloat(price), isLuna, lunaPrice);
        const stakeableLP = parseFloat(userPoolBalances[key].balance) / UNIT;
        const poolValue = getPoolValues(stakeableLP, lpValue, parseFloat(price), isLuna, parseFloat(lunaPrice));
        const { stakeableLpUstValue } = poolValue;
        total = total + parseFloat(stakeableLpUstValue);
        poolsData.push({ symbol1, symbol2, lpName, price, ...poolValue, stakedLp: "0", stakeableLp: stakeableLP.toString() });
    });
    await Promise.all(poolTask);
    return { list: poolsData, total: total.toString() }
}

