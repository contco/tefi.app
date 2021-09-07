import { convertToFloatValue } from '../../../utils/convertFloat';

export const getMirrorBorrowData = (borrow) => {
  const getBorrowedTotal = () => {
    const totalBorrowed = borrow.reduce((a, shortAsset) => a + parseFloat(shortAsset?.borrowInfo?.amountValue), 0);
    return totalBorrowed.toString();
  };

  const getCollateralTotal = () => {
    const totalCollateral = borrow.reduce(
      (a, shortAsset) => a + parseFloat(shortAsset?.collateralInfo?.collateralValue),
      0,
    );
    return totalCollateral.toString();
  };

  const myborrow = borrow
    .slice()
    .sort((a, b) => parseFloat(b?.collateralInfo?.collateralRatio) - parseFloat(a?.collateralInfo?.collateralRatio));

  const data = myborrow.map((assets: MirrorShortFarm) => {
    return [
      { name: assets?.assetInfo?.name },
      {
        price: convertToFloatValue(assets?.assetInfo?.price) + ' UST',
      },
      {
        balance: {
          token: convertToFloatValue(assets?.borrowInfo.amount) + ' ' + assets?.assetInfo?.symbol,
          tokenValue: convertToFloatValue(assets?.borrowInfo.amountValue) + ' UST',
        },
      },
      {
        balance: {
          token: convertToFloatValue(assets?.collateralInfo?.collateral) + ' ' + assets?.collateralInfo?.csymbol,
          tokenValue:
            assets?.collateralInfo?.csymbol === 'UST'
              ? null
              : convertToFloatValue(assets?.collateralInfo?.collateralValue) + ' UST',
        },
      },
      {
        ratio: parseFloat(assets?.collateralInfo?.collateralRatio).toFixed(2) + ' %',
      },
    ];
  });

  return {
    titles: ['Name', 'Price', 'Borrowed', 'Collateral', 'Collateral Ratio'],
    data: data,
    total: [
      { name: 'Borrowed', value: convertToFloatValue(getBorrowedTotal()) + ' UST' },
      { name: 'Collateral', value: convertToFloatValue(getCollateralTotal()) + ' UST' },
    ],
  };
};
