import { getPrice } from '../../commons';
import { UNIT } from '../../mirror/utils';
import { getLpValue } from '../../utils';
import { getPoolValues } from './getPoolValues';

export const getLpStakingInfo = (poolInfo, lpTokenInfo, holderLPInfo) => {
  const lpName = 'LOTA-UST';
  const symbol1 = 'LOTA';
  const symbol2 = 'UST';
  const price = getPrice(poolInfo);
  let lpValue = getLpValue(poolInfo, parseFloat(price));
  let stakeableLp = parseFloat(lpTokenInfo.balance) / UNIT;
  let stakedLp = parseFloat(holderLPInfo.balance) / UNIT;
  let LpStakeInfo: any = getPoolValues(stakedLp, stakeableLp, lpValue, parseFloat(price));
  if (stakedLp == 0 && stakeableLp == 0) {
    return null;
  }
  return { symbol1, symbol2, lpName, lpValue, price, stakedLp, stakeableLp, ...LpStakeInfo };
};
