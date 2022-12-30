import { getLpValue } from './getLpValue';
import { getPrice } from './getPrice';
import { MICRO } from '../constants';


export const calculateLpBonding = (bondAmount: string, poolResponse: any ) => {
   const tokenPrice = parseFloat(getPrice(poolResponse));
   const lpValue = getLpValue(poolResponse, tokenPrice);
   const lpAmount = parseFloat(bondAmount) / MICRO;
   const lpUstValue = lpAmount * lpValue;
   const token1 = (lpAmount / 2) * lpValue;
   const token2 = token1 / tokenPrice;
   return {lpAmount, lpUstValue, token1, token2};
}