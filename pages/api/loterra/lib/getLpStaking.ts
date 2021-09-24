import { getPrice } from '../../commons';
import { UNIT } from '../../mirror/utils';
import { getLpValue } from '../../utils';
import { getPoolValues } from './getPoolValues';

export const getLpStakingInfo = (poolInfo, lpTokenInfo, holderLPInfo) => {
  if(lpTokenInfo?.balance  === '0' && holderLPInfo?.balancce === '0') {
    return null
   }
  const lpName = 'LOTA-UST';
  const symbol1 = 'LOTA';
  const symbol2 = 'UST';
  const price = getPrice(poolInfo);
  let lpValue = getLpValue(poolInfo, parseFloat(price));
  let stakeableLp = parseFloat(lpTokenInfo.balance) / UNIT;
  let stakedLp = parseFloat(holderLPInfo.balance) / UNIT;
  let LpStakeInfo: any = getPoolValues(stakedLp, stakeableLp, lpValue, parseFloat(price));
  return { symbol1, symbol2, lpName, lpValue, price, stakedLp, stakeableLp, ...LpStakeInfo };
};
