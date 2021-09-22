import { convertToFloatValue } from '../../../utils/convertFloat';

export const getlotaPoolFarms = (lotaPool) => {
  if (!lotaPool?.stakedData || lotaPool?.stakedData.length === 0) {
    return {};
  }
  const data = [
    [
      { name: lotaPool.lpname },
      {
        lpData: {
          lp: convertToFloatValue(lotaPool?.stakedLp) + ' LP',
          token1: convertToFloatValue(lotaPool?.token2Staked) + ' ' + lotaPool?.symbol1,
          token2: convertToFloatValue(lotaPool?.token1Staked) + ' ' + lotaPool?.symbol2,
        },
      },
      {
        value: '$' + convertToFloatValue(lotaPool?.stakedLpUstValue),
      },
    ],
  ];

  return {
    titles: ['Name', 'Staked', 'Value'],
    data: data,
    total: [{ name: 'Total Staked Value', value: convertToFloatValue(lotaPool?.totalStakedLpUstValue) + ' UST' }],
    totalValue: parseFloat(lotaPool?.totalStakedLpUstValue),
  };
};
