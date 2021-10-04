import { convertToFloatValue } from '../../../utils/convertFloat';

export const getStarterraFarms = (starterra) => {
  if (!starterra?.stakedData || starterra?.stakedData.length === 0) {
    return {};
  }

  const data = starterra.stakedData.map((data: StarStakedData) => {
    const bonded =
      data?.bondedLp !== '0'
        ? {
            lpData: {
              lp: convertToFloatValue(data?.bondedLp) + ' LP',
              token1: convertToFloatValue(data?.token2Bonded) + ' ' + starterra?.symbol2,
              token2: convertToFloatValue(data?.token1Bonded) + ' ' + starterra?.symbol1,
            },
          }
        : { value: '-' };
    return [
      { name: data.lpName },
      { faction: data.faction },
      {
        lpData: {
          lp: convertToFloatValue(data?.stakedLp) + ' LP',
          token1: convertToFloatValue(data?.token2Staked) + ' ' + starterra?.symbol2,
          token2: convertToFloatValue(data?.token1Staked) + ' ' + starterra?.symbol1,
        },
      },
      bonded,
      {
        value: data?.unbondingTime,
      },
      {
        reward: {
          token: convertToFloatValue(data?.rewards) + ' ' + starterra.symbol2,
          tokenValue: '$' + convertToFloatValue(data?.rewardsValue),
        },
      },
    ];
  });

  return {
    titles: ['Name', 'Faction', 'Staked', 'Bonded', 'Unbonding Time', 'Reward'],
    data: data,
    total: [
      {
        name: 'Total LP Value',
        value:
          convertToFloatValue(
            (parseFloat(starterra?.totalStakedLpUstValue) + parseFloat(starterra?.totalBondedLpUstValue)).toString(),
          ) + ' UST',
      },
      { name: 'Total Reward Value', value: convertToFloatValue(starterra?.totalRewardsValue) + ' UST' },
    ],
    totalValue: parseFloat(starterra?.totalStakedLpUstValue) + parseFloat(starterra?.totalBondedLpUstValue),
    totalReward: parseFloat(starterra?.totalRewardsValue),
  };
};
