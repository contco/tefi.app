import {getLpTokenBalance} from "./getLPTokenBalance";
import {getStakingRewards} from "./getStakingRewards";
import {getPairPool} from "./getPairPool";
import {balance, BalanceKey, parsePairPool, UUSD, fromLP} from "./utils";
import MIRROR_ASSETS from "./mirrorAssets.json";
 



export const getPoolData = async (address: string) => {
 let lpTokenBalance = getLpTokenBalance(address);
 let stakingRewards = getStakingRewards(address);
 let pairsList = getPairPool();
 let results = await Promise.all([lpTokenBalance, stakingRewards, pairsList]);
 let poolBalance = balance[BalanceKey.LPTOTAL](results[0], results[1]);
 let result = MIRROR_ASSETS.map((listing:ListedItem) => {
     let pairPool = results[2] && results[2][listing.token] ? parsePairPool(results[2][listing.token]) : { uusd: "0", asset: "0", total: "0" };
     const shares = {
        asset: { amount: pairPool.asset, token: listing.token },
        uusd: { amount: pairPool.uusd, token: UUSD },
      }
      const lpDetails = fromLP(poolBalance[listing.token], shares, pairPool.total)
     return {...listing, ...pairPool, withdrawable:lpDetails};
 });

 console.log(results[1]);
}