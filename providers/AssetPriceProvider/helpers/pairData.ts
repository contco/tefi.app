import { assets } from '../../../constants/assets';
import { subYears } from 'date-fns';
import { request } from 'graphql-request';
import { TERRA_SWAP_GRAPHQL_URL } from '../../../constants';
import { GET_PAIRS_DATA } from '../../../graphql/queries/getPairsData';
import { getTokenKey, calculatePriceChange } from '.';

export const fetchPairData = async () => {
  const poolAddresses = Object.keys(assets).map((keyName) => assets[keyName].poolAddress);
  const toDate = new Date();
  const fromDate = subYears(toDate, 1);

  let data: any = {};
  try {
    const { pairs } = await request(TERRA_SWAP_GRAPHQL_URL, GET_PAIRS_DATA, {
      from: fromDate.getTime() / 1000,
      to: toDate.getTime() / 1000,
      interval: 'DAY',
      pairAddresses: poolAddresses,
    });

    Object.keys(assets).map((keyName: string, index: number) => {
      const tokenKey = getTokenKey(pairs[index], keyName);
      const { priceChange, percentChange } = calculatePriceChange({ ...pairs[index], tokenKey });
      const historicalData = pairs[index]?.historicalData;
      const currentPrice = parseFloat(historicalData[0][`${tokenKey}Price`]).toFixed(4);
      data[keyName] = { ...assets[keyName], priceChange, percentChange, tokenKey, currentPrice, historicalData };
    });
  } catch (error) {
    data = {};
  }
  return data;
};
