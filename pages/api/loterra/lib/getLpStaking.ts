import { getPrice } from "@contco/terra-utilities";
import { UNIT } from '../../mirror/utils';
import { getLpValue } from '../../utils';
import { getPoolValues } from './getPoolValues';
import { calculateAPY } from "./calculateApy";

const LP_NAME = 'LOTA-UST';
const SYMBOL1 = 'UST'
const SYMBOL2 = "LOTA";




export const getLpStakingInfo = (poolInfo, lpTokenInfo, holderLPInfo, lpRewardsInfo, stateLpStakingInfo) => {
  if (lpTokenInfo?.balance === '0' && holderLPInfo?.balance === '0') {
    return null;
  }
  const price = getPrice(poolInfo);
  const lpValue = getLpValue(poolInfo, parseFloat(price));
  const stakeableLp = parseFloat(lpTokenInfo.balance) / UNIT;
  const stakedLp = parseFloat(holderLPInfo.balance) / UNIT;
  const rewards = lpRewardsInfo?.rewards / UNIT;
  const apyData = calculateAPY(poolInfo, stateLpStakingInfo);
  const rewardsValue = parseFloat(price) * rewards;
  const LpStakeInfo: any = getPoolValues(stakedLp, stakeableLp, lpValue, parseFloat(price));
  return { symbol1: SYMBOL1, symbol2: SYMBOL2, lpName: LP_NAME, lpValue: lpValue.toString(), price, stakedLp: stakedLp.toString(), stakeableLp: stakeableLp.toString(), rewardsValue: rewardsValue.toString(), rewards: rewards.toString(), rewardsSymbol: SYMBOL2,  ...apyData, ...LpStakeInfo };
};
