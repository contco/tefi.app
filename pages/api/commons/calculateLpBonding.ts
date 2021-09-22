import { getLpValue } from '../utils';
import {getPrice} from '.';
import { UNIT } from '../mirror/utils';

export const calculateLpBonding = (bond_amount: string, poolResponse: any ) => {
   const tokenPrice = parseFloat(getPrice(poolResponse));
   const lpValue = getLpValue(poolResponse, tokenPrice);
   const lpAmount = parseFloat(bond_amount) / UNIT;
   const lpUstValue = lpAmount * lpValue;
   const token1 = (lpAmount / 2) * lpValue;
   const token2 = token1 / tokenPrice;
   return {lpAmount, lpUstValue, token1, token2};
}