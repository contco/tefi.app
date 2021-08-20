import { assets } from '../../../constants/assets';
export {fetchPairData} from './pairData';


export const getTokenKey = (pairData, keyName: string) => {
    if(pairData?.token0?.symbol === assets[keyName].terraSwapSymbol){
      return 'token0';
    }
    else {
      return 'token1';
    }
  }

export const calculatePriceChange = (singlePair) => {
    const dayCurrentPrice = singlePair?.historicalData[0]?.[`${singlePair.tokenKey}Price`];
    const dayOldPrice = singlePair?.historicalData[1]?.[`${singlePair.tokenKey}Price`];
    const change = parseFloat(dayCurrentPrice) - parseFloat(dayOldPrice);
    const percentChange = (change / parseFloat(dayOldPrice)) * 100;
    const roundOff = Math.abs(percentChange).toFixed(2);
    let signedPercentage = '1';
    if (percentChange < 0) {
      signedPercentage = (parseFloat(roundOff) * -1).toFixed(2);
    } else {
      signedPercentage = roundOff;
    }
    
    return {priceChange: change, percentChange:signedPercentage};
  };

export const updateAssetPriceData = (price: string, key: string, pairData: any) => {
    const pair = { ...pairData[key] };
    const newHistoricalData = [...pair?.historicalData];
    newHistoricalData[0][`${pair?.tokenKey}Price`] = price;
    const updatedPair = { ...pair, currentPrice: price,  historicalData: newHistoricalData };
    const {priceChange, percentChange} = calculatePriceChange(updatedPair);
    updatedPair.priceChange = priceChange;
    updatedPair.percentChange = percentChange;
    const newPairsData = { ...pairData, [key]: updatedPair };
    return newPairsData;
  };
