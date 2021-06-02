import {getLpTokenBalance} from "./getLpTokenBalance";
import {getStakingRewards} from "./getStakingRewards";
import {getStakingPool} from "./getStakingPool";
import {getPairPool} from "./getPairPool";
import {balance, BalanceKey, PriceKey,parsePairPool, UUSD, fromLP, price, div, UNIT, times, plus} from "./utils";
import MIRROR_ASSETS from "./mirrorAssets.json";
 


export const getMirrorPool = async(address: string) => {
   let rewardsSum = '0';
   let poolSum = '0';
   let lpTokenBalance = getLpTokenBalance(address);
   let stakingRewards = getStakingRewards(address);
   let stakingPool = getStakingPool();
   let pairsList = getPairPool();
   let results = await Promise.all([lpTokenBalance, stakingRewards, pairsList, stakingPool]);
   let poolBalance = balance[BalanceKey.LPTOTAL](results[0], results[1]);
   let rewardsBalance = balance[BalanceKey.REWARD](results[3], results[1]);
   let result = MIRROR_ASSETS.reduce((poolList, listing: ListedItem) => {
      let pairPool = results[2] && results[2][listing.token] ? parsePairPool(results[2][listing.token]) : { uusd: "0", asset: "0", total: "0" };
      const shares = {
         asset: { amount: pairPool.asset, token: listing.token },
         uusd: { amount: pairPool.uusd, token: UUSD },
       };
      const lpDetails = fromLP(poolBalance[listing.token], shares, pairPool.total);
       if (lpDetails?.asset?.amount!=="0" ) {
       
        const priceKey = listing.status === "LISTED" ? PriceKey.PAIR : PriceKey.END;
        const priceResult = price[priceKey](results[2])[listing.token];
        const item1Balance = div(lpDetails.asset.amount, UNIT);
        const item2Balance = div(lpDetails.uusd.amount, UNIT);
        const balanceValue = plus(times(item1Balance, priceResult ?? 0), item2Balance);
        const rewards = div(rewardsBalance[listing.token], UNIT);
        const rewardsValue = times(rewards, priceResult);
        const poolTotal = plus(balanceValue, rewardsValue);
         
        poolSum = plus(poolSum, balanceValue);
        rewardsSum = plus(rewardsSum, rewardsValue);
       return {symbol1: listing.symbol, symbol2: 'UST', balance1:item1Balance, balance2: item2Balance, balanceValue, priceResult, rewards, rewardsValue, poolTotal };
       }
       return poolList;
   }, []);
   return {poolData: result, rewardsSum, poolSum};
}

export const getPoolData = async (address: string) => {
   let {poolData} = await getMirrorPool(address);
   return poolData;
}

export const getPoolTotal = async (address: string) => {
   let {poolSum, rewardsSum} = await getMirrorPool(address);
   return {poolSum, rewardsSum};
}