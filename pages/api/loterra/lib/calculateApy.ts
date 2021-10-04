import { MICRO } from "@contco/terra-utilities";

export const calculateAPY = (poolInfo, stateLPStaking) => {
  if (poolInfo.total_share && stateLPStaking.total_balance) {
    const ratio = poolInfo.total_share / poolInfo.assets[0].amount;
    const inLota = stateLPStaking.total_balance / ratio;
    const totalStaked = inLota / MICRO;
    const apy = (100000 / totalStaked);
    return { apy, totalStaked };
  }
};
