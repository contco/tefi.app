import { getPrice, MICRO, math } from '@contco/terra-utilities';

const SYMBOL = "LOTA";
const NAME = "LOTA Gov";

const getLotaRewards = (claims: any) => {
  if (claims && claims.length > 0) {
    const totalClaims = claims.reduce((acm, item) => math.plus(acm + item), '0');
    const lotaBalance = math.div(totalClaims, MICRO);
    return lotaBalance;
  }
  return '0';
};

export const getGovInfo = (holderInfo, poolInfo, claimInfo) => {

  if(holderInfo?.balance === "0") {
    return null;
  }
  const staked = math.div(holderInfo?.balance, MICRO);
  const price = getPrice(poolInfo);
  const value = math.times(staked, price);
  const lotaRewards = getLotaRewards(claimInfo?.claims);
  const lotaRewardsValue = math.times(lotaRewards, price);
  const ustRewards = holderInfo?.pending_rewards !== '0' ? math.div(holderInfo?.pending_rewards, MICRO) : '0';
  const ustRewardsInLota = math.div(ustRewards, price);
  const rewards = math.plus(lotaRewards, ustRewardsInLota);
  const rewardsValue = math.plus(lotaRewardsValue, ustRewards);
  const apr = '0';
  return { name: NAME, symbol: SYMBOL, staked, value, rewards, rewardsValue, apr, price };
};
