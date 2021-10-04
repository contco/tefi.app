import { getPrice, MICRO, math } from '@contco/terra-utilities';

const SYMBOL = "TWD";
const NAME = "TWD Gov";

export const getGovInfo = (poolInfo, govStakingInfo) => {

  if(govStakingInfo?.bond_amount === "0") {
    return null;
  }
  const price = getPrice(poolInfo);

  const staked = math.div(govStakingInfo?.bond_amount, MICRO);
  const value = math.times(staked, price);
  const rewards = math.div(govStakingInfo.pending_reward, MICRO);
  const rewardsValue = math.times(rewards, price);
  const apr = '0';
  return { name: NAME, symbol: SYMBOL, staked, value, rewards, rewardsValue, apr, price };
};
