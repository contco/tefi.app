import numeral from 'numeral';

export const calculateAPY = (poolInfo, stateLPStaking) => {
  if (poolInfo.total_share && stateLPStaking.total_balance) {
    const ratio = poolInfo.total_share / poolInfo.assets[0].amount;
    const inLota = stateLPStaking.total_balance / ratio;
    //console.log("test",inLota / 1000000)
    const totalStaked = inLota / 1000000;
    const apy = numeral((100000 / totalStaked) * 100).format('0');
    return { apy, totalStaked };
  }
};
