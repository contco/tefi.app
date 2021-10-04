import { getPrice, MICRO, math } from '@contco/terra-utilities';
import { contracts } from './contracts';

const SYMBOL = "TWD";
const NAME = "Terra World Token";


export const getWalletHoldings = (poolInfo, tokenInfo) => {
  if(tokenInfo?.balance === "0") {
    return null;
  }
  const price = getPrice(poolInfo);
  const balance = math.div(tokenInfo.balance,MICRO);
  const value = math.times(balance, price)
  const contract = contracts.token;
  return { name: NAME, symbol: SYMBOL, price, balance, value , contract};
};
