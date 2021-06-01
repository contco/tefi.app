import {getLpTokenBalance} from "./getLPTokenBalance";
import {getStakingRewards} from "./getStakingRewards";
import {getPairPool} from "./getPairPool";
import {balance, BalanceKey} from "./utils";
 



export const getPoolData = async (address: string) => {
 let lpTokenBalance = getLpTokenBalance(address);
 let stakingRewards = getStakingRewards(address);
 let pairPool = getPairPool();
 let results = await Promise.all([lpTokenBalance, stakingRewards, pairPool]);
 let poolBalance = balance[BalanceKey.LPTOTAL](results[0], results[1]);
 console.log(results[2]);
 console.log(poolBalance)
}