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

export const getPoolValues = (lpDetails, priceResult) => {
  const tokenStaked = div(lpDetails.asset.amount, UNIT);
  const ustStaked = div(lpDetails.uusd.amount, UNIT);
  const tokenStakedValue = times(tokenStaked, priceResult ?? 0);

  const stakedLpUstValue = plus(tokenStakedValue, ustStaked);
  return { tokenStaked, tokenStakedValue, ustStaked, stakedLpUstValue };
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
  return { ...poolValues, ...rewards, apr, availableLpUstValue: '0', ustUnStaked: '0', tokenUnStaked: '', availableLP: '0' };
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
  console.log("pairlist", pairsList)
  console.log('lptokenblance', lpTokenBalance);
  console.log('stakeingpool', stakingPool);
  console.log('stakingrewards', stakingRewards);

  const poolBalance = balance[BalanceKey.LPTOTAL](lpTokenBalance, stakingRewards);
  console.log('poolbalance', poolBalance);
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
    console.log("poolBalance[listing.token]", poolBalance[listing.token]);
    console.log("bondAmount", bondAmount);
    const lpDetails = fromLP(bondAmount, shares, pairPool.total);
    const priceKey = listing.status === 'LISTED' ? PriceKey.PAIR : PriceKey.END;
    const priceResult = price[priceKey](stakingPool)[listing.token];
    if (tokenBalance[listing.token]?.balance !== '0') {
      const holdingsData = getHoldingsData(tokenBalance, priceResult, listing.token);
      mirrorHoldingsSum = plus(mirrorHoldingsSum, holdingsData.value);
      mirrorHoldings.push({ symbol: listing.symbol, name: listing.name, price: priceResult, ...holdingsData });
    }
    if (lpDetails?.asset?.amount !== '0') {
      const lpBalance = div(bondAmount, 1000000);
      const poolData = calculatePoolDetails(listing, rewardsBalance, priceResult, lpDetails, assetStats?.apr, mirPrice);
      mirrorPoolSum = plus(mirrorPoolSum, poolData.stakedLpUstValue);
      mirrorPoolRewardsSum = plus(mirrorPoolRewardsSum, poolData.rewardsValue);
      poolList.push({ symbol: listing.symbol, lpName: `${listing.symbol}-UST LP`, stakedLP: lpBalance ?? 0, rewardsSymbol: MIR, ...poolData });
    }
    return poolList;
  }, []);;
  const account = { mirrorStaking: result, mirrorHoldings, airdrops: mirrorAirdrops, gov, total: { mirrorPoolSum, mirrorPoolRewardsSum, mirrorHoldingsSum, mirrorAirdropSum } };
  return account;
};
