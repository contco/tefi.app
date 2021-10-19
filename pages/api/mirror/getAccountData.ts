import { math, MICRO } from '@contco/terra-utilities';
import { getLpTokenBalance } from './getLpTokenBalance';
import { getStakingRewards } from './getStakingRewards';
import { getStakingPool } from './getStakingPool';
import { getPairPool } from './getPairPool';
import { getAssetsStats } from './getAssetsStats';
import { getTokenBalance } from './getTokenBalance';
import getShortInfo from './getShortInfo';
import {formatAirdrops, getAirdrops} from "./getAirdrops";
import { getGovData, fetchGovBalance } from './getGovData';
import { balance, BalanceKey, PriceKey, parsePairPool, UUSD, fromLP, price, MIR } from './utils';
import MIRROR_ASSETS from './mirrorAssets.json';
const MIR_TOKEN = MIRROR_ASSETS[0].token;

const {div , times, plus} = math;


export const getPoolValues = (stakedLpDetails, unstakedLpDetails, priceResult) => {
  const token1Staked = div(stakedLpDetails.uusd.amount, MICRO);
  const token2Staked = div(stakedLpDetails.asset.amount, MICRO);
  const tokenStakedValue = times(token2Staked, priceResult ?? 0);
  const stakedLpUstValue = plus(token1Staked, tokenStakedValue);

  const token1UnStaked = div(unstakedLpDetails.uusd.amount, MICRO);
  const token2UnStaked = div(unstakedLpDetails.asset.amount, MICRO);
  const tokenUnStakedValue = times(token2UnStaked, priceResult ?? 0);
  const stakeableLpUstValue = plus(token1UnStaked, tokenUnStakedValue);

  const totalLpUstValue = plus(stakedLpUstValue, stakeableLpUstValue);

  return { token1Staked, token2Staked, token1UnStaked, token2UnStaked, stakedLpUstValue, stakeableLpUstValue, totalLpUstValue };
};

export const getApr = (assetStats, token) => {
  const apr = assetStats ? assetStats?.apr?.[token] : '0';
  return apr ?? 0;
};

export const getShortApr = (assetStats, token) => {
  const shortApr = assetStats ? assetStats?.shortApr?.[token] : '0';
  return shortApr ?? 0;
}

export const getHoldingsData = (tokenBalance, priceResult, token) => {
  const balance = div(tokenBalance[token].balance, MICRO);
  const value = times(balance, priceResult ?? 0);
  return { balance, value };
};

export const getRewards = (rewardsBalance, listing, priceResult) => {
  const rewards = div(rewardsBalance[listing.token], MICRO);
  const rewardsValue = times(rewards, priceResult);
  return { rewards, rewardsValue };
};

export const calculatePoolDetails = (listing, rewardsBalance, priceResult, stakedLpDetails, unstakedLpDetails, assetStats, mirPrice) => {
  const rewards = getRewards(rewardsBalance, listing, mirPrice);
  const poolValues = getPoolValues(stakedLpDetails, unstakedLpDetails, priceResult);
  const apr = getApr(assetStats, listing.token);
  return { ...poolValues, ...rewards, apr };
};
export const fetchData = (address: string) => {
  const lpTokenBalancePromise = getLpTokenBalance(address);
  const stakingRewardsPromise  = getStakingRewards(address);
  const pairsListPromise  = getPairPool();
  const stakingPoolPromise  = getStakingPool();
  const assetStatsPromise  = getAssetsStats();
  const tokenBalancePromise  = getTokenBalance(address);
  const airdrops = getAirdrops(address);
  const govBalancePromise = fetchGovBalance(address);
  const shortDataPromise = getShortInfo(address);
  return Promise.all([lpTokenBalancePromise , stakingRewardsPromise , pairsListPromise , stakingPoolPromise , assetStatsPromise , tokenBalancePromise, airdrops, govBalancePromise, shortDataPromise ]);
}

export const getMirrorAccount = async (address: string) => {
  try {
  let mirrorPoolRewardsSum = '0';
  let mirrorPoolSum = '0';
  let mirrorHoldingsSum = '0';
  
  const [lpTokenBalance, stakingRewards, pairsList, stakingPool, assetStats, tokenBalance, airdropsData, govBalance, shortData] = await fetchData(address);
  const rewardsBalance = stakingPool && stakingRewards ? balance[BalanceKey.REWARD](stakingPool, stakingRewards) : null;
  const longStakedBalance = stakingRewards ? balance[BalanceKey.LPLONGSTAKED](stakingRewards) : null;
  const stakeableBalance = lpTokenBalance ? balance[BalanceKey.LPSTAKABLE](lpTokenBalance) : null;

  const mirPrice = pairsList ? price["pair"](pairsList)[MIR_TOKEN] : '0';
  const { mirrorAirdrops, airdropSum: mirrorAirdropSum } = formatAirdrops(airdropsData, mirPrice);
  const mirrorHoldings = [];

  const gov = getGovData(govBalance, assetStats?.statistic);
  const result = MIRROR_ASSETS.reduce((poolList, listing: ListedItem) => {
    const priceKey = listing.status === 'LISTED' ? PriceKey.PAIR : PriceKey.END;
    const priceResult = pairsList ? price[priceKey](pairsList)[listing.token] : '0';
    if (tokenBalance && tokenBalance[listing.token]?.balance !== '0') {
      const holdingsData = getHoldingsData(tokenBalance, priceResult, listing.token);
      mirrorHoldingsSum = plus(mirrorHoldingsSum, holdingsData.value);
      mirrorHoldings.push({ symbol: listing.symbol, name: listing.name, contract: listing.token, price: priceResult, ...holdingsData });
    }
    if (stakingPool && pairsList && stakingRewards) {
      const pairPool =
        pairsList && pairsList[listing.token]
          ? parsePairPool(pairsList[listing.token])
          : { uusd: '0', asset: '0', total: '0' };
      const shares = {
        asset: { amount: pairPool.asset, token: listing.token },
        uusd: { amount: pairPool.uusd, token: UUSD },
      };
      if(longStakedBalance?.[listing.token] || stakeableBalance?.[listing.token]){
        const stakedAmount = longStakedBalance?.[listing.token] ?? '0';
        const stakeableAmount = stakeableBalance?.[listing.token] ?? '0';
        const stakedLpDetails = fromLP(stakedAmount, shares, pairPool.total);
        const unstakedLpDetails = fromLP(stakeableAmount, shares, pairPool.total);
      if (stakedLpDetails?.asset?.amount !== '0' || unstakedLpDetails?.asset?.amount !== '0') {
        const stakedLpBalance = div(stakedAmount, MICRO);
        const unStakedLpBalance = div(stakeableAmount, MICRO);
        const poolData = calculatePoolDetails(listing, rewardsBalance, priceResult, stakedLpDetails, unstakedLpDetails, assetStats, mirPrice);
        mirrorPoolSum = plus(mirrorPoolSum, poolData.stakedLpUstValue);
        mirrorPoolRewardsSum = plus(mirrorPoolRewardsSum, poolData.rewardsValue);
        poolList.push({ symbol1: 'UST', symbol2: listing.symbol, lpName: `${listing.symbol}-UST LP`, stakedLp: stakedLpBalance ?? "0", stakeableLp: unStakedLpBalance ?? "0", rewardsSymbol: MIR, ...poolData });
      }
      }
    }
    return poolList;
  }, []);

  const account = { mirrorShortFarm: shortData, mirrorStaking: result, mirrorHoldings, airdrops: mirrorAirdrops, gov, total: { mirrorPoolSum, mirrorPoolRewardsSum, mirrorHoldingsSum, mirrorAirdropSum } };
  return account;
  }
  catch(err) {
    const emptyAccount =  { mirrorShortFarm: [] ,mirrorStaking: [], mirrorHoldings: [], airdrops: [], gov: null, total: { mirrorPoolSum: '0', mirrorPoolRewardsSum: '0', mirrorHoldingsSum: '0', mirrorAirdropSum:'0'}};
    return emptyAccount;
  }
};
