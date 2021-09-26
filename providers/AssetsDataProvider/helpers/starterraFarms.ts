import { convertToFloatValue } from '../../../utils/convertFloat';

export const getStarterraFarms = (starterra) => {
  if (!starterra?.stakedData || starterra?.stakedData.length === 0) {
    return {};
  }

  const data = starterra.stakedData.map((data: StarStakedData) => {
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
      {
        value: '$' + convertToFloatValue(data?.stakedLpUstValue),
      },
      {
        reward: {
          token: convertToFloatValue(data?.rewards) + ' ' + starterra.symbol1,
          tokenValue: '$' + convertToFloatValue(data?.rewardsValue),
        },
      },
    ];
  });

  return {
    titles: ['Name', 'Faction', 'Staked', 'Value', 'Reward'],
    data: data,
    total: [
      { name: 'Total Staked Value', value: convertToFloatValue(starterra?.totalStakedLpUstValue) + ' UST' },
      { name: 'Total Reward Value', value: convertToFloatValue(starterra?.totalRewardsValue) + ' UST' },
    ],
    totalValue: parseFloat(starterra?.totalStakedLpUstValue),
    totalReward: parseFloat(starterra?.totalRewardsValue),
  };
};
