import { getPrice } from "@contco/terra-utilities";
import { UNIT } from '../../mirror/utils';
import { getLpValue } from '../../utils';
import { getPoolValues } from './getPoolValues';

const LP_NAME = 'LOTA-UST';
const SYMBOL1 = 'UST'
const SYMBOL2 = "LOTA";

export const getLpStakingInfo = (poolInfo, lpTokenInfo, holderLPInfo) => {
  if (lpTokenInfo?.balance === '0' && holderLPInfo?.balancce === '0') {
    return null;
  }
  const price = getPrice(poolInfo);
  const lpValue = getLpValue(poolInfo, parseFloat(price));
  const stakeableLp = parseFloat(lpTokenInfo.balance) / UNIT;
  const stakedLp = parseFloat(holderLPInfo.balance) / UNIT;
  const LpStakeInfo: any = getPoolValues(stakedLp, stakeableLp, lpValue, parseFloat(price));
  return { symbol1: SYMBOL1, symbol2: SYMBOL2, lpName: LP_NAME, lpValue: lpValue.toString(), price, stakedLp: stakedLp.toString(), stakeableLp: stakeableLp.toString(), ...LpStakeInfo };
};
