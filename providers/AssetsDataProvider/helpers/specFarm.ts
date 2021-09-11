import { convertToFloatValue } from '../../../utils/convertFloat';

export const getSpecFarmData = (spectrum) => {
  const getFarmsTotal = () => {
    return spectrum?.spectrumTotal?.farmsTotal.toString();
  };

  const data = spectrum.farms.map((farm: SpecFarms) => {
    return [
      { name: farm.lpName },
      { farm: farm.farm },
      {
        lpData: {
          lp: convertToFloatValue(farm?.stakedLp) + ' LP',
          token1: convertToFloatValue(farm?.tokenStaked) + ' ' + farm?.symbol,
          token2: convertToFloatValue(farm?.ustStaked) + ' UST',
        },
      },
      {
        value: '$' + convertToFloatValue(farm?.stakedLpUstValue),
      },
    ];
  });

  if (!spectrum?.farms || spectrum?.farms.length === 0) {
    return {};
  }

  return {
    titles: ['Name', 'Farm', 'Balance', 'Value'],
    data: data,
    total: '$' + convertToFloatValue(getFarmsTotal()),
    totalValue: parseFloat(getFarmsTotal()),
  };
};
