import { div, times } from '../../../../utils/math';
import { UNIT } from '../../mirror/utils';
import { getPrice } from '@contco/terra-utilities';
import { contracts } from './contracts';

const SYMBOL = "TWD";
const NAME = "Terra World Token";


export const getWalletHoldings = (poolInfo, tokenInfo) => {
  if(tokenInfo?.balance === "0") {
    return null;
  }
  const price = getPrice(poolInfo);
  const balance = div(tokenInfo.balance,UNIT);
  const value = times(balance, price)
  const contract = contracts.token;
  return { name: NAME, symbol: SYMBOL, price, balance, value , contract};
};
