import { convertToFloatValue } from '../../../utils/convertFloat';
import { times } from '../../../utils/math';

export const getSpecRewardData = (spectrum) => {
  const getRewardsTotal = () => {
    return spectrum?.spectrumTotal?.rewardsTotal ?? '0';
  };

  const formatApr = (apr = '0') => {
    const aprPercentage = times(apr, 100);
    return parseFloat(aprPercentage).toFixed(2);
  };

  const data = spectrum.farms.map((farm: SpecFarms) => {
    let totalReward;
    if (farm.farm !== 'Spectrum') {
      totalReward = {
        reward: {
          token: convertToFloatValue(farm?.tokenRewardsStaked) + ' ' + farm?.tokenRewardsStakedSymbol,
          tokenValue: '$' + convertToFloatValue(farm?.tokenRewardsStakedValue),
        },
      };
    } else {
      totalReward = {
        na: 'N/A',
      };
    }

    return [
      { name: farm.lpName },
      { apy: formatApr(farm.apy) + '%' },
      {
        reward: {
          token: convertToFloatValue(farm?.stakedSpec) + ' SPEC',
          tokenValue: '$' + convertToFloatValue(farm?.stakedSpecValue),
        },
      },
      totalReward,
    ];
  });

  if (!spectrum?.farms || spectrum?.farms.length === 0) {
    return {};
  }

  return {
    titles: ['Name', 'APY', 'SPEC Rewards', 'Total Rewards'],
    data: data,
    total: '$' + convertToFloatValue(getRewardsTotal()),
    totalReward: parseFloat(getRewardsTotal()),
  };
};
