import { div, times, plus } from '../../../../utils/math';
import { UNIT } from '../../mirror/utils';
import { getPrice } from '../../commons';

const getLotaRewards = (claims: any) => {
  if (claims && claims.length > 0) {
    const totalClaims = claims.reduce((acm, item) => plus(acm + item), '0');
    const lotaBalance = div(totalClaims, UNIT);
    return lotaBalance;
  }
  return '0';
};

export const getGovInfo = (holderInfo, poolInfo, claimInfo) => {
  const name = 'LOTA Gov';
  const symbol = 'LOTA';
  const staked = div(holderInfo?.balance, UNIT);
  const price = getPrice(poolInfo);
  const value = times(staked, price);
  const lotaRewards = getLotaRewards(claimInfo?.claims);
  const lotaRewardsValue = times(lotaRewards, price);
  const ustRewards = holderInfo?.pending_rewards !== '0' ? div(holderInfo?.pending_rewards, UNIT) : '0';
  const ustRewardsInLota = div(ustRewards, price);
  const rewards = plus(lotaRewards, ustRewardsInLota);
  const rewardsValue = plus(lotaRewardsValue, ustRewards);
  const apr = '0';
  return { name, symbol, staked, value, rewards, rewardsValue, apr, price };
};