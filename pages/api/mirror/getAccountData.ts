import { getLpTokenBalance } from './getLpTokenBalance';
import { getStakingRewards } from './getStakingRewards';
import { getStakingPool } from './getStakingPool';
import { getPairPool } from './getPairPool';
import { getAssetsStats } from './getAssetsStats';
import { getTokenBalance } from './getTokenBalance';
import {formatAirdrops, getAirdrops} from "./getAirdrops";
import { balance, BalanceKey, PriceKey, parsePairPool, UUSD, fromLP, price, div, UNIT, times, plus } from './utils';
import MIRROR_ASSETS from './mirrorAssets.json';
const MIR_TOKEN = MIRROR_ASSETS[0].token;

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
  const amount = div(tokenBalance[token].balance, UNIT);
  const balance = times(amount, priceResult ?? 0);
  return { amount, balance };
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

export const fetchData = (address: string) => {
  const lpTokenBalancePromise = getLpTokenBalance(address);
  const stakingRewardsPromise  = getStakingRewards(address);
  const stakingPoolPromise  = getStakingPool();
  const pairsListPromise  = getPairPool();
  const assetStatsPromise  = getAssetsStats();
  const tokenBalancePromise  = getTokenBalance(address);
  const airdrops = getAirdrops(address);
  return Promise.all([lpTokenBalancePromise , stakingRewardsPromise , pairsListPromise , stakingPoolPromise , assetStatsPromise , tokenBalancePromise, airdrops ]);
}

export const getAccountData = async (address: string) => {
  let rewardsSum = '0';
  let stakedSum = '0';
  let unstakedSum = '0';
  
  const [lpTokenBalance, stakingRewards, stakingPool, pairsList, assetStats, tokenBalance, airdropsData ] = await fetchData(address);

  const poolBalance = balance[BalanceKey.LPTOTAL](lpTokenBalance, stakingRewards);
  const rewardsBalance = balance[BalanceKey.REWARD](pairsList, stakingRewards);
  const mirPrice = price["pair"](stakingPool)[MIR_TOKEN];
  const {mirrorAirdrops, airdropSum} = formatAirdrops(airdropsData, mirPrice);
  
  const result = MIRROR_ASSETS.reduce((poolList, listing: ListedItem) => {
    let lpBalance;
    let poolData;
    let stakeableTokenData;
    const pairPool =
    stakingPool && stakingPool[listing.token]
        ? parsePairPool(stakingPool[listing.token])
        : { uusd: '0', asset: '0', total: '0' };
    const shares = {
      asset: { amount: pairPool.asset, token: listing.token },
      uusd: { amount: pairPool.uusd, token: UUSD },
    };

    const lpDetails = fromLP(poolBalance[listing.token], shares, pairPool.total);
    const priceKey = listing.status === 'LISTED' ? PriceKey.PAIR : PriceKey.END;
    const priceResult = price[priceKey](stakingPool)[listing.token];
    if (tokenBalance[listing.token]?.balance !== '0') {
      stakeableTokenData = getStakeableToken(tokenBalance, priceResult, listing.token);
      unstakedSum = plus(unstakedSum, stakeableTokenData.balance);
    }
    if (lpDetails?.asset?.amount !== '0') {
      lpBalance = div(poolBalance[listing.token], 1000000);
      poolData = calculatePoolDetails(listing, rewardsBalance, priceResult, lpDetails, assetStats);
      stakedSum = plus(stakedSum, poolData.stakeTotalUstValue);
      rewardsSum = plus(rewardsSum, poolData.rewardsUstValue);
    }
    if (poolData || stakeableTokenData) {
      poolList.push({ symbol: listing.symbol, name: listing.name, price: priceResult, lpBalance: lpBalance ?? 0,  ...poolData, ...stakeableTokenData });
    }

    return poolList;
  }, []);
  const account = { assets: result, airdrops: mirrorAirdrops, total: { rewardsSum, stakedSum, unstakedSum, airdropSum} };
  return account;
};
