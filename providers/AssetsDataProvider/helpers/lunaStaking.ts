import { convertToFloatValue } from '../../../utils/convertFloat';

export const getLunaStakingData = (core) => {
  const getLunaStakingRewards = () => {
    let total = 0;
    for (const a in core.staking) {
      total += parseFloat(core.staking[a]?.rewardsValue);
    }

    return total;
  };

  const getStakedTotal = () => {
    const total = core?.total?.stakedSum;
    return total.toString() ?? '0';
  };

  const getUnStakedTotal = () => {
    const total = core?.total?.unstakedSum;
    return total.toString() ?? '0';
  };

  const data = core.staking.map((asset: LunaStaking) => {
    return [
      {
        name: asset.validator,
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

  if (!core?.staking || core.staking.length === 0) {
    return {};
  }

  return {
    titles: ['Validator', 'Balance', 'Rewards', 'Value', 'State'],
    data: data,
    total: [
      { name: 'Staked Total', value: '$' + convertToFloatValue(getStakedTotal()) },
      { name: 'Unstaked Total', value: '$' + convertToFloatValue(getUnStakedTotal()) },
    ],
    totalValue: parseFloat(getStakedTotal()) + parseFloat(getUnStakedTotal()),
    totalReward: getLunaStakingRewards(),
  };
};
