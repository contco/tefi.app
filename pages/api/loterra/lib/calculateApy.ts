import numeral from 'numeral';

export const calculateAPY = (poolInfo, stateLPStaking) => {
  if (poolInfo.total_share && stateLPStaking.total_balance) {
    const ratio = poolInfo.total_share / poolInfo.assets[0].amount;
    const inLota = stateLPStaking.total_balance / ratio;
    //console.log("test",inLota / 1000000)
    const total_staked = inLota / 1000000;
    const APY = numeral((100000 / total_staked) * 100).format('0');
    return APY;
  }
};
