import { getPrice, getLpValue, MICRO, math } from "@contco/terra-utilities";
import { getPoolValues } from './getPoolValues';

const LP_NAME = 'TWD-UST';
const SYMBOL1 = 'UST'
const SYMBOL2 = "TWD";

export const getLpStakingInfo = (poolInfo, stakedLpInfo, LpTokenInfo) => {
  if (stakedLpInfo?.bond_amount === '0' && LpTokenInfo?.balance === '0') {
    return null;
  }
  const price = getPrice(poolInfo);
  const lpValue = getLpValue(poolInfo, parseFloat(price));
  const stakedLp = parseFloat(stakedLpInfo?.bond_amount) / MICRO;
  const stakeableLp = parseFloat(LpTokenInfo?.balance) / MICRO;
  const LpStakeInfo: any = getPoolValues(stakedLp, stakeableLp, lpValue, parseFloat(price));
  const rewards = (stakedLpInfo?.pending_reward/ MICRO).toString();
  const rewardsValue = math.times(rewards, price);
  const rewardsSymbol = SYMBOL2;
  const apr = '0';
  return { symbol1: SYMBOL1, symbol2: SYMBOL2, lpName: LP_NAME, lpValue: lpValue.toString(), price, stakedLp: stakedLp.toString(), stakeableLp: stakeableLp.toString(), ...LpStakeInfo, rewards, rewardsValue, apr, rewardsSymbol };
};
