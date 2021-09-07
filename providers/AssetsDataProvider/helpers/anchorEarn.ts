import { convertToFloatValue } from '../../../utils/convertFloat';

export const getAnchorEarnData = (earn) => {
  return {
    titles: ['Total Deposit', 'APY'],
    data: [
      [
        { deposit: '$' + convertToFloatValue(earn?.reward?.staked) },
        { apy: convertToFloatValue(earn?.reward?.apy) + '%' },
      ],
    ],
    total: '$' + convertToFloatValue(earn?.reward?.staked),
  };
};
