import { getPrice } from "@contco/terra-utilities";
import { times } from "../../../../utils/math";
import { UNIT } from '../../mirror/utils';
import { getLpValue } from '../../utils';
import { getPoolValues } from './getPoolValues';

const LP_NAME = 'TWD-UST';
const SYMBOL1 = 'UST'
const SYMBOL2 = "TWD";

export const getLpStakingInfo = (poolInfo, stakedLpInfo, LpTokenInfo) => {
  if (stakedLpInfo?.bond_amount === '0' && LpTokenInfo?.balancce === '0') {
    return null;
  }
  const price = getPrice(poolInfo);
  const lpValue = getLpValue(poolInfo, parseFloat(price));
  const stakedLp = parseFloat(stakedLpInfo?.bond_amount) / UNIT;
  const stakeableLp = parseFloat(LpTokenInfo?.balance) / UNIT;
  const LpStakeInfo: any = getPoolValues(stakedLp, stakeableLp, lpValue, parseFloat(price));
  const rewards = (stakedLpInfo?.pending_reward/ UNIT).toString();
  const rewardsValue = times(rewards, price);
  const apr = '0';
  return { symbol1: SYMBOL1, symbol2: SYMBOL2, lpName: LP_NAME, lpValue: lpValue.toString(), price, stakedLp: stakedLp.toString(), stakeableLp: stakeableLp.toString(), ...LpStakeInfo, rewards, rewardsValue, apr };
};
