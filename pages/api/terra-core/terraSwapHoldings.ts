import {SWAP_TOKENS} from "./symbols";
import {getPoolInfo, getUserTokenBalance, getPrice} from "../commons";
import { times, div } from "../../../utils/math";
import { UNIT } from "../mirror/utils";

const convertPrice = (poolPrice: string, price: string) => {
    const convertedPrice = times(poolPrice, price);
    return convertedPrice;
}

export const fetchTerraSwapHoldings = async (address:string, lunaUstPrice: string) => { 
    const terraSwapHoldings = [];
    let terraSwapHoldingsSum = '0';
    const swapTasks = SWAP_TOKENS.map(async (item) => {
        const balancePromise = getUserTokenBalance(address, item.token_addr);
        const poolPromise = getPoolInfo(item.pool_addr);
        const [balance, poolInfo] = await Promise.all([balancePromise, poolPromise]);
        if(balance !== "0") {
        const poolPrice = getPrice(poolInfo);
        const price = item.isLunaPair ? convertPrice(poolPrice, lunaUstPrice) : poolPrice;
        const blunaBlanace = div(balance, UNIT);
        const value = times(blunaBlanace, price);
        terraSwapHoldingsSum = times(terraSwapHoldingsSum, value);
        terraSwapHoldings.push({ name: item.name, symbol: item.symbol, value, balance: blunaBlanace, price });
        }
        return item;
    });
    await Promise.all(swapTasks);
    return {terraSwapHoldingsSum, terraSwapHoldings};
}