import { div, times } from '../../../../utils/math';
import { UNIT } from '../../mirror/utils';
import { getPrice } from '@contco/terra-utilities';

const SYMBOL = "TWD";
const NAME = "TWD Gov";



export const getGovInfo = (poolInfo, govStakingInfo) => {

  if(govStakingInfo?.bond_amount === "0") {
    return null;
  }
  const price = getPrice(poolInfo);

  const staked = div(govStakingInfo?.bond_amount, UNIT);
  const value = times(staked, price);
  const rewards = div(govStakingInfo.pending_reward, UNIT);
  const rewardsValue = times(rewards, price);
  const apr = '0';
  return { name: NAME, symbol: SYMBOL, staked, value, rewards, rewardsValue, apr, price };
};
