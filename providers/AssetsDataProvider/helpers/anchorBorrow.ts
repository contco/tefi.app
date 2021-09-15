import { convertToFloatValue } from '../../../utils/convertFloat';

export const getAnchorBorrowData = (borrow) => {
  if (!borrow?.collaterals) return {};

  const collaterals = borrow.collaterals.map((item) => {
    return {
      token: convertToFloatValue(item.balance) + ' ' + item.symbol,
      tokenValue: '$' + convertToFloatValue(item.value),
    };
  });

  if (!borrow?.collaterals) return {};

  return {
    titles: ['Collateral List', 'Collateral Value', 'Borrowed Value', 'Net APR'],
    data: [
      [
        { collateralList: collaterals },
        {
          collateralValue: '$' + convertToFloatValue(borrow?.totalCollateralValue),
        },
        {
          borrowedValue: '$' + convertToFloatValue(borrow?.value),
        },
        {
          apr: convertToFloatValue(borrow?.netApy) + '%',
        },
      ],
    ],
    percentage: parseFloat(parseFloat(borrow?.percentage).toFixed(2)),
    total: '$' + convertToFloatValue(borrow?.value),
    totalValue: parseFloat(borrow?.totalCollateralValue),
    totalBorrow: parseFloat(borrow?.value),
  };
};
