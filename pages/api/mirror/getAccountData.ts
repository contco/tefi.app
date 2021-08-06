import { getLpTokenBalance } from './getLpTokenBalance';
import { getStakingRewards } from './getStakingRewards';
import { getStakingPool } from './getStakingPool';
import { getPairPool } from './getPairPool';
import { getAssetsStats } from './getAssetsStats';
import { getTokenBalance } from './getTokenBalance';
import { formatAirdrops, getAirdrops } from "./getAirdrops";
import { getGovData, fetchGovBalance } from './getGovData';
import { balance, BalanceKey, PriceKey, parsePairPool, UUSD, fromLP, price, div, UNIT, times, plus, MIR } from './utils';
import MIRROR_ASSETS from './mirrorAssets.json';
const MIR_TOKEN = MIRROR_ASSETS[0].token;

export const getPoolValues = (stakedLpDetails, unstakedLpDetails, priceResult) => {
  const token1Staked = div(stakedLpDetails.uusd.amount, UNIT);
  const token2Staked = div(stakedLpDetails.asset.amount, UNIT);
  const tokenStakedValue = times(token2Staked, priceResult ?? 0);
  const stakedLpUstValue = plus(token1Staked, tokenStakedValue);

  const token1UnStaked = div(unstakedLpDetails.uusd.amount, UNIT);
  const token2UnStaked = div(unstakedLpDetails.asset.amount, UNIT);
  const tokenUnStakedValue = times(token2UnStaked, priceResult ?? 0);
  const stakeableLpUstValue = plus(token1UnStaked, tokenUnStakedValue);

  const totalLpUstValue = plus(stakedLpUstValue, stakeableLpUstValue);

  return { token1Staked, token2Staked, token1UnStaked, token2UnStaked, stakedLpUstValue, stakeableLpUstValue, totalLpUstValue };
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

export const calculatePoolDetails = (listing, rewardsBalance, priceResult, stakedLpDetails, unstakedLpDetails, assetStats, mirPrice) => {
  const rewards = getRewards(rewardsBalance, listing, mirPrice);
  const poolValues = getPoolValues(stakedLpDetails, unstakedLpDetails, priceResult);
  const apr = getApr(assetStats, listing.token);
  return { ...poolValues, ...rewards, apr };
};

export const fetchData = (address: string) => {
  const lpTokenBalancePromise = getLpTokenBalance(address);
  const stakingRewardsPromise = getStakingRewards(address);
  const stakingPoolPromise = getStakingPool();
  const pairsListPromise = getPairPool();
  const assetStatsPromise = getAssetsStats();
  const tokenBalancePromise = getTokenBalance(address);
  const airdrops = getAirdrops(address);
  const govBalancePromise = fetchGovBalance(address);
  return Promise.all([lpTokenBalancePromise, stakingRewardsPromise, pairsListPromise, stakingPoolPromise, assetStatsPromise, tokenBalancePromise, airdrops, govBalancePromise]);
}

export const getAccountData = async (address: string) => {
  let mirrorPoolRewardsSum = '0';
  let mirrorPoolSum = '0';
  let mirrorHoldingsSum = '0';

  const [lpTokenBalance, stakingRewards, stakingPool, pairsList, assetStats, tokenBalance, airdropsData, govBalance] = await fetchData(address);
  const rewardsBalance = balance[BalanceKey.REWARD](pairsList, stakingRewards);
  const mirPrice = price["pair"](stakingPool)[MIR_TOKEN];
  const { mirrorAirdrops, airdropSum: mirrorAirdropSum } = formatAirdrops(airdropsData, mirPrice);

  const mirrorHoldings = [];
  const gov = getGovData(govBalance, assetStats?.statistic);

  const result = MIRROR_ASSETS.reduce((poolList, listing: ListedItem) => {
    const pairPool =
      stakingPool && stakingPool[listing.token]
        ? parsePairPool(stakingPool[listing.token])
        : { uusd: '0', asset: '0', total: '0' };
    const shares = {
      asset: { amount: pairPool.asset, token: listing.token },
      uusd: { amount: pairPool.uusd, token: UUSD },
    };
    let bondAmount = '0';
    stakingRewards.reward_infos.map((staked) => {
      if (staked.asset_token === listing.token) {
        bondAmount = staked.bond_amount;
      }
    })
    const stakedLpDetails = fromLP(bondAmount, shares, pairPool.total);
    const unstakedLpDetails = fromLP(lpTokenBalance[listing.token].balance, shares, pairPool.total);

    const priceKey = listing.status === 'LISTED' ? PriceKey.PAIR : PriceKey.END;
    const priceResult = price[priceKey](stakingPool)[listing.token];
    if (tokenBalance[listing.token]?.balance !== '0') {
      const holdingsData = getHoldingsData(tokenBalance, priceResult, listing.token);
      mirrorHoldingsSum = plus(mirrorHoldingsSum, holdingsData.value);
      mirrorHoldings.push({ symbol: listing.symbol, name: listing.name, price: priceResult, ...holdingsData });
    }
    if (stakedLpDetails?.asset?.amount !== '0') {
      const stakedLpBalance = div(bondAmount, 1000000);
      const unStakedLpBalance = div(lpTokenBalance[listing.token].balance, 1000000);

      const poolData = calculatePoolDetails(listing, rewardsBalance, priceResult, stakedLpDetails, unstakedLpDetails, assetStats?.apr, mirPrice);
      mirrorPoolSum = plus(mirrorPoolSum, poolData.totalLpUstValue);
      mirrorPoolRewardsSum = plus(mirrorPoolRewardsSum, poolData.rewardsValue);
      poolList.push({ symbol1: 'UST', symbol2: listing.symbol, lpName: `${listing.symbol}-UST LP`, stakedLp: stakedLpBalance ?? "0", stakeableLp: unStakedLpBalance ?? "0", rewardsSymbol: MIR, ...poolData });
    }
    return poolList;
  }, []);;

  const account = { mirrorStaking: result, mirrorHoldings, airdrops: mirrorAirdrops, gov, total: { mirrorPoolSum, mirrorPoolRewardsSum, mirrorHoldingsSum, mirrorAirdropSum } };
  return account;
};
