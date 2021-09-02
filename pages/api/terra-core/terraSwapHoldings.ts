import { SWAP_TOKENS } from "./symbols";
import { getPoolInfo, getUserTokenBalance, getPrice } from "../commons";
import { times, div, plus } from "../../../utils/math";
import { UNIT } from "../mirror/utils";
import { fetchData } from "../commons";

const BASSETS_INFO = 'https://api.anchorprotocol.com/api/v1/bassets/';

const convertPrice = (poolPrice: string, price: string) => {
    const convertedPrice = times(poolPrice, price);
    return convertedPrice;
}

export const fetchTerraSwapHoldings = async (address: string, lunaUstPrice?: string) => {
    try {
        const bEthRequest = await fetchData(BASSETS_INFO + 'beth');
        const [bEthInfo] = await Promise.all([bEthRequest]);
          
        const terraSwapHoldings = [];
        let terraSwapHoldingsSum = '0';
        const swapTasks = SWAP_TOKENS.map(async (item) => {
            const balancePromise = getUserTokenBalance(address, item.token_addr);
            const poolPromise = getPoolInfo(item?.pool_addr);
            const [balance, poolInfo] = await Promise.all([balancePromise, poolPromise]);

            if (balance !== "0") {
                const poolPrice = getPrice(poolInfo);
                let price = ''
                if(item.symbol !== 'bETH'){
                    price = item.isLunaPair ? convertPrice(poolPrice, lunaUstPrice) : poolPrice;
                }
                else {
                    price = bEthInfo?.data?.beth_price
                }
                const bondedBalance = div(balance, UNIT);
                const value = times(bondedBalance, price);
                terraSwapHoldingsSum = plus(terraSwapHoldingsSum, value);
                terraSwapHoldings.push({ name: item.name, symbol: item.symbol, contract: item.token_addr, value, balance: bondedBalance, price });
            }
            return item;
        });
        await Promise.all(swapTasks);
        return { terraSwapHoldingsSum, terraSwapHoldings };
    }
    catch (err) {
        return { terraSwapHoldingsSum: '0', terraSwapHoldings: [] }
    }
}