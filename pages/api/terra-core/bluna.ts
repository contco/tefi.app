import {BLUNA} from "./symbols";
import {getPoolInfo, getUserTokenBalance, getPrice} from "../commons";
import { times, div } from "../../../utils/math";
import { UNIT } from "../mirror/utils";



export const fetchBlunaDetails = async (address:string, lunaUstPrice: string) => { 
    const balancePromise = getUserTokenBalance(address, BLUNA.token_addr);
    const poolPromise = getPoolInfo(BLUNA.pool_addr);
    const [balance, poolInfo] = await Promise.all([balancePromise, poolPromise]);
    if(balance === "0") {
        return [];
    }
    else {
        const priceInLuna = getPrice(poolInfo);
        const priceInUst = times(priceInLuna, lunaUstPrice);
        const price = times(priceInLuna,lunaUstPrice);
        const blunaBlanace = div(balance, UNIT);
        const value = times(blunaBlanace, priceInUst);
        return [{ name: BLUNA.name, symbol: BLUNA.symbol, value, balance: blunaBlanace, price }];
    }
}