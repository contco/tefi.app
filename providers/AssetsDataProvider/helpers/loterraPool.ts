import { convertToFloatValue } from '../../../utils/convertFloat';

export const getlotaPoolFarms = (lotaPool) => {
  if (lotaPool !== null) {
    const data = [
      [
        { name: lotaPool.lpName },
        {
          APY: lotaPool.apy + '%'
        },
        {
          lpData: {
            lp: convertToFloatValue(lotaPool?.stakedLp) + ' LP',
            token1: convertToFloatValue(lotaPool?.token1Staked) + ' ' + lotaPool?.symbol1,
            token2: convertToFloatValue(lotaPool?.token2Staked) + ' ' + lotaPool?.symbol2,
          },
        },
        
        {
          value: '$' + convertToFloatValue(lotaPool?.stakedLpUstValue),
        },
        
        {
          rewards: lotaPool.rewards + ' Lota'
        }
      ],
    ];

    return {
      titles: ['Name','APY', 'Staked' , 'Value' , 'Rewards'],
      data: data,
      totalValue: parseFloat(lotaPool?.stakedLpUstValue),
    };
  }
  return null
};
