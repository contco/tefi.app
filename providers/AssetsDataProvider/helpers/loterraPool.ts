import { convertToFloatValue } from '../../../utils/convertFloat';

export const getlotaPoolFarms = (lotaPool) => {
  console.log('lotaPool >>', lotaPool);
  if (lotaPool !== null) {
    const data = [
      [
        { name: lotaPool.lpName },
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
  }
  return null
};
