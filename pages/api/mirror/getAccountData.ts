import { getLpTokenBalance } from './getLpTokenBalance';
import { getStakingRewards } from './getStakingRewards';
import { getStakingPool } from './getStakingPool';
import { getPairPool } from './getPairPool';
import { getAssetsStats } from './getAssetsStats';
import { getTokenBalance } from './getTokenBalance';
import { balance, BalanceKey, PriceKey, parsePairPool, UUSD, fromLP, price, div, UNIT, times, plus } from './utils';
import MIRROR_ASSETS from './mirrorAssets.json';

export const getPoolValues = (lpDetails, priceResult) => {
  const item1Balance = div(lpDetails.asset.amount, UNIT);
  const item2Balance = div(lpDetails.uusd.amount, UNIT);
  const tokenStakedUstValue = times(item1Balance, priceResult ?? 0);

  const balanceValue = plus(tokenStakedUstValue, item2Balance);
  return { tokenStaked: item1Balance, tokenStakedUstValue, ustStaked: item2Balance, stakeTotalUstValue: balanceValue };
};

export const getApr = (assetStats, token) => {
  const apr = assetStats ? assetStats[token] : '0';
  return apr ?? 0;
};
export const getPoolTotalWithRewards = (balanceValue, rewardsValue) => {
  const poolTotalWithRewards = plus(balanceValue, rewardsValue);
  return poolTotalWithRewards;
};

export const getStakeableToken = (tokenBalance, priceResult, token) => {
  const balance = div(tokenBalance[token].balance, UNIT);
  const value = times(balance, priceResult ?? 0);
  return { unstakedToken: balance, unstakedUstValue: value };
};

export const getRewards = (rewardsBalance, listing, priceResult) => {
  const rewards = div(rewardsBalance[listing.token], UNIT);
  const rewardsValue = times(rewards, priceResult);
  return { rewards, rewardsUstValue: rewardsValue };
};

export const calculatePoolDetails = (listing, rewardsBalance, priceResult, lpDetails, assetStats) => {
  const rewards = getRewards(rewardsBalance, listing, priceResult);
  const poolValues = getPoolValues(lpDetails, priceResult);
  const poolTotalWithRewards = getPoolTotalWithRewards(poolValues.stakeTotalUstValue, rewards.rewardsUstValue);
  const apr = getApr(assetStats, listing.token);
  return { ...poolValues, ...rewards, apr, poolTotalWithRewards };
};

export const getAccountData = async (address: string) => {
  let rewardsSum = '0';
  let stakedSum = '0';
  let unstakedSum = '0';
  let lpTokenBalance = getLpTokenBalance(address);
  let stakingRewards = getStakingRewards(address);
  let stakingPool = getStakingPool();
  let pairsList = getPairPool();
  let assetStats = getAssetsStats();
  let tokenBalance = getTokenBalance(address);

  let results = await Promise.all([lpTokenBalance, stakingRewards, pairsList, stakingPool, assetStats, tokenBalance]);

  let poolBalance = balance[BalanceKey.LPTOTAL](results[0], results[1]);
  let rewardsBalance = balance[BalanceKey.REWARD](results[3], results[1]);

  let result = MIRROR_ASSETS.reduce((poolList, listing: ListedItem) => {
    let poolData;
    let stakeableTokenData;
    let pairPool =
      results[2] && results[2][listing.token]
        ? parsePairPool(results[2][listing.token])
        : { uusd: '0', asset: '0', total: '0' };
    const shares = {
      asset: { amount: pairPool.asset, token: listing.token },
      uusd: { amount: pairPool.uusd, token: UUSD },
    };
    const lpDetails = fromLP(poolBalance[listing.token], shares, pairPool.total);
    const priceKey = listing.status === 'LISTED' ? PriceKey.PAIR : PriceKey.END;
    const priceResult = price[priceKey](results[2])[listing.token];
    if (results[5][listing.token]?.balance !== '0') {
      stakeableTokenData = getStakeableToken(results[5], priceResult, listing.token);
      unstakedSum = plus(unstakedSum, stakeableTokenData.unstakedUstValue);
    }
    if (lpDetails?.asset?.amount !== '0') {
      poolData = calculatePoolDetails(listing, rewardsBalance, priceResult, lpDetails, results[4]);
      stakedSum = plus(stakedSum, poolData.stakeTotalUstValue);
      rewardsSum = plus(rewardsSum, poolData.rewardsUstValue);
    }
    if (poolData || stakeableTokenData) {
      poolList.push({ symbol: listing.symbol, ...poolData, ...stakeableTokenData });
    }

    return poolList;
  }, []);
  let account = { assets: result, total: { rewardsSum, stakedSum, unstakedSum } };
  console.log(account);
  return account;
};