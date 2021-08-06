import { getLpTokenBalance } from './getLpTokenBalance';
import { getStakingRewards } from './getStakingRewards';
import { getStakingPool } from './getStakingPool';
import { getPairPool } from './getPairPool';
import { getAssetsStats } from './getAssetsStats';
import { getTokenBalance } from './getTokenBalance';
import {formatAirdrops, getAirdrops} from "./getAirdrops";
import { getGovData, fetchGovBalance } from './getGovData';
import { balance, BalanceKey, PriceKey, parsePairPool, UUSD, fromLP, price, div, UNIT, times, plus, MIR } from './utils';
import MIRROR_ASSETS from './mirrorAssets.json';
const MIR_TOKEN = MIRROR_ASSETS[0].token;

export const getPoolValues = (lpDetails, priceResult) => {
  const tokenStaked = div(lpDetails.asset.amount, UNIT);
  const ustStaked = div(lpDetails.uusd.amount, UNIT);
  const tokenStakedValue = times(tokenStaked, priceResult ?? 0);

  const stakedLpUstValue = plus(tokenStakedValue, ustStaked);
  return { tokenStaked,tokenStakedValue, ustStaked, stakedLpUstValue };
};

export const getApr = (assetStats, token) => {
  const apr = assetStats ? assetStats[token] : '0';
  return apr ?? 0;
};

export const getHoldingsData = (tokenBalance, priceResult, token) => {
  const balance = div(tokenBalance[token].balance, UNIT);
  const value = times(balance, priceResult ?? 0);
  return { balance, value };
};

export const getRewards = (rewardsBalance, listing, priceResult) => {
  const rewards = div(rewardsBalance[listing.token], UNIT);
  const rewardsValue = times(rewards, priceResult);
  return { rewards, rewardsValue };
};

export const calculatePoolDetails = (listing, rewardsBalance, priceResult, lpDetails, assetStats, mirPrice) => {
  const rewards = getRewards(rewardsBalance, listing, mirPrice);
  const poolValues = getPoolValues(lpDetails, priceResult);
  const apr = getApr(assetStats, listing.token);
  return { ...poolValues, ...rewards, apr, availableLpUstValue: '0', ustUnStaked: '0',tokenUnStaked: '', availableLP: '0' };
};

export const fetchData = (address: string) => {
  const lpTokenBalancePromise = getLpTokenBalance(address);
  const stakingRewardsPromise  = getStakingRewards(address);
  const stakingPoolPromise  = getStakingPool();
  const pairsListPromise  = getPairPool();
  const assetStatsPromise  = getAssetsStats();
  const tokenBalancePromise  = getTokenBalance(address);
  const airdrops = getAirdrops(address);
  const govBalancePromise = fetchGovBalance(address);
  return Promise.all([lpTokenBalancePromise , stakingRewardsPromise , pairsListPromise , stakingPoolPromise , assetStatsPromise , tokenBalancePromise, airdrops, govBalancePromise ]);
}

export const getAccountData = async (address: string) => {
  let mirrorPoolRewardsSum = '0';
  let mirrorPoolSum = '0';
  let mirrorHoldingsSum = '0';
  
  const [lpTokenBalance, stakingRewards, pairsList, stakingPool, assetStats, tokenBalance, airdropsData, govBalance] = await fetchData(address);
  const poolBalance = lpTokenBalance && stakingRewards ? balance[BalanceKey.LPTOTAL](lpTokenBalance, stakingRewards) : null;
  const rewardsBalance = stakingPool && stakingRewards ? balance[BalanceKey.REWARD](stakingPool, stakingRewards) : null;
  const mirPrice = pairsList ? price["pair"](pairsList)[MIR_TOKEN] : '0';
  
  const {mirrorAirdrops, airdropSum: mirrorAirdropSum} = formatAirdrops(airdropsData, mirPrice);
  const mirrorHoldings = [];
  const gov = getGovData(govBalance, assetStats?.statistic);
  const result = MIRROR_ASSETS.reduce((poolList, listing: ListedItem) => {
    const priceKey = listing.status === 'LISTED' ? PriceKey.PAIR : PriceKey.END;
    const priceResult = pairsList ? price[priceKey](pairsList)[listing.token] : '0';
    if (tokenBalance && tokenBalance[listing.token]?.balance !== '0') {
      const holdingsData = getHoldingsData(tokenBalance, priceResult, listing.token);
      mirrorHoldingsSum = plus(mirrorHoldingsSum, holdingsData.value);
      mirrorHoldings.push({ symbol: listing.symbol, name: listing.name, price: priceResult, ...holdingsData});
    }
    if(stakingPool && pairsList && poolBalance && stakingRewards) {
    const pairPool =
    pairsList && pairsList[listing.token]
        ? parsePairPool(pairsList[listing.token])
        : { uusd: '0', asset: '0', total: '0' };
    const shares = {
      asset: { amount: pairPool.asset, token: listing.token },
      uusd: { amount: pairPool.uusd, token: UUSD },
    };

    const lpDetails = fromLP(poolBalance[listing.token], shares, pairPool.total);
    if (lpDetails?.asset?.amount !== '0') {
      const lpBalance = div(poolBalance[listing.token], 1000000);
      const poolData = calculatePoolDetails(listing, rewardsBalance, priceResult, lpDetails, assetStats?.apr, mirPrice);
      mirrorPoolSum = plus(mirrorPoolSum, poolData.stakedLpUstValue);
      mirrorPoolRewardsSum = plus(mirrorPoolRewardsSum, poolData.rewardsValue);
      poolList.push({ symbol: listing.symbol, lpName: `${listing.symbol}-UST LP`, stakedLP: lpBalance ?? 0, rewardsSymbol: MIR,   ...poolData });
    }
    }
    return poolList;
  }, []);;
  const account = { mirrorStaking: result, mirrorHoldings, airdrops: mirrorAirdrops, gov, total: { mirrorPoolSum, mirrorPoolRewardsSum, mirrorHoldingsSum, mirrorAirdropSum} };
  return account;
};
