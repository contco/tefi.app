import { convertToFloatValue } from '../../../utils/convertFloat';

export const getLunaStakingData = (core) => {
  const getStakedTotal = () => {
    const total = core?.total?.stakedSum;
    return convertToFloatValue(total.toString()) ?? '0';
  };

  const getUnStakedTotal = () => {
    const total = core?.total?.unstakedSum;
    return convertToFloatValue(total.toString()) ?? '0';
  };

  const data = core.staking.map((asset: LunaStaking) => {
    return [
      {
        validator: asset.validator,
      },
      {
        balance: {
          token: convertToFloatValue(asset.balance) + ' Luna',
          tokenValue: '$' + convertToFloatValue(asset.stakedValue),
        },
      },

      {
        reward: {
          token: convertToFloatValue(asset.rewards) + ' Luna',
          tokenValue: '$' + convertToFloatValue(asset.rewardsValue),
        },
      },
      {
        value: '$' + convertToFloatValue(asset.totalValue),
      },
      {
        state: asset.state,
      },
    ];
  });

  return {
    titles: ['Validator', 'Balance', 'Rewards', 'Value', 'State'],
    data: data,
    total: [
      { name: 'Staked Total', value: '$' + getStakedTotal() },
      { name: 'Unstaked Total', value: '$' + getUnStakedTotal() },
    ],
  };
};
