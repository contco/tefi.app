import { convertToFloatValue } from '../../../utils/convertFloat';

export const getPylonGatewayData = (pylon) => {
  const getGatewayTotal = () => {
    const total = parseFloat(pylon?.pylonSum?.gatewayDepositsSum);
    return total.toString() ?? '0';
  };

  const gatewayData = pylon.pylonGateway
    .slice()
    .sort((a, b) => parseFloat(b.rewardsValue) - parseFloat(a.rewardsValue));

  const data = gatewayData.map((asset: PylonGateway) => {
    return [
      {
        name: asset.poolName,
      },
      {
        deposit: '$' + convertToFloatValue(asset.totalDeposit),
      },

      {
        reward: {
          token: convertToFloatValue(asset.rewards) + ' ' + asset.symbol,
          tokenValue: '$' + convertToFloatValue(asset?.rewardsValue),
        },
      },
    ];
  });

  if (!gatewayData || gatewayData.length === 0) {
    return {};
  }

  return {
    titles: ['Pool Name', 'Deposit', 'Rewards'],
    data: data,
    total: [
      { name: 'Total Deposits', value: '$' + convertToFloatValue(getGatewayTotal()) },
      { name: 'Rewards', value: '$' + convertToFloatValue(pylon.pylonSum.gatewayRewardsSum) },
    ],
    totalValue: parseFloat(getGatewayTotal()),
    totalReward: parseFloat(pylon.pylonSum.gatewayRewardsSum),
  };
};
