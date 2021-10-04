import { plus } from '../../../utils/math';
import { convertToFloatValue } from '../../../utils/convertFloat';
import { assets } from '../../../constants/assets';

export const getAssetData = (anchor, mirror, pylon, core, spectrum, terraworld) => {
  const getAssetsTotal = () => {
    const mirrorTotal = mirror?.total?.mirrorHoldingsSum;
    const coreTotal = core?.total?.assetsSum;
    const pylonHoldingsSum = pylon?.pylonSum?.pylonHoldingsSum;
    const spectrumSum = spectrum?.spectrumTotal?.holdingsTotal;
    const anchorTotal = anchor?.total?.anchorHoldingsSum;
    const terraworldSum = terraworld?.twdHoldings?.value ?? '0';
    const total =
      parseFloat(spectrumSum) +
      parseFloat(plus(mirrorTotal, coreTotal)) +
      parseFloat(anchorTotal) +
      parseFloat(pylonHoldingsSum) +
      parseFloat(terraworldSum);
    return total.toString() ?? '0';
  };
  const holdings = [
    ...spectrum?.specHoldings,
    ...pylon?.pylonHoldings,
    ...mirror?.mirrorHoldings,
    ...core?.coins,
    ...anchor?.assets,
  ];
  if(terraworld?.twdHoldings){
    holdings.push(terraworld?.twdHoldings);
  }
  const sortedHoldings = holdings.sort((a: any, b: any) => b.value - a.value);
  const largerHoldings = sortedHoldings.filter((asset: Holdings) => parseFloat(asset?.value) >= 1);

  const data = sortedHoldings.map((asset: Holdings) => {
    const symbol = assets[asset.symbol.toLowerCase()] ? { url: asset.symbol } : { name: asset.symbol };

    return [
      symbol,
      { name: asset.name },
      { value: convertToFloatValue(asset.balance) },
      { price: '$' + convertToFloatValue(asset.price) },
      { value: '$' + convertToFloatValue(asset.value) },
    ];
  });

  const largeData = largerHoldings.map((asset: Holdings) => {
    const symbol = assets[asset.symbol.toLowerCase()] ? { url: asset.symbol } : { name: asset.symbol };
    return [
      symbol,
      { name: asset.name },
      { value: convertToFloatValue(asset.balance) },
      { price: '$' + convertToFloatValue(asset.price) },
      { value: '$' + convertToFloatValue(asset.value) },
    ];
  });

  return {
    titles: ['Ticker', 'Name', 'Balance', 'Price', 'Value'],
    data: data,
    largeData: largeData,
    total: '$' + convertToFloatValue(getAssetsTotal()),
		totalValue: parseFloat(getAssetsTotal())
  };
};
