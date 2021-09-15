import { convertToFloatValue } from '../../../utils/convertFloat';

export const getAnchorEarnData = (earn) => {
  if (parseFloat(earn?.reward?.staked) <= 0) return {};
  return {
    titles: ['Total Deposit', 'APY'],
    data: [
      [
        { deposit: '$' + convertToFloatValue(earn?.reward?.staked) },
        { apr: convertToFloatValue(earn?.reward?.apy) + '%' },
      ],
    ],
    total: '$' + convertToFloatValue(earn?.reward?.staked),
    totalValue: parseFloat(earn?.reward?.staked),
  };
};
