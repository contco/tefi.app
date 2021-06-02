import MIRROR_ASSETS from "./mirrorAssets.json";
import {gql} from "@apollo/client";
import {request} from "graphql-request";
import networks from "./networks";
import {alias, parse, PriceKey, price, times, div, plus, UNIT} from "./utils";
import {getPairPool} from "./getPairPool";
import { getPoolTotal } from "./getPoolData";

const TOKEN_BALANCE = "TokenBalance";


const getMirrorAssets = async (address: string) => {
  const generate = ({ token }: ListedItem) => {
    return { contract: token, msg: { balance: { address } } }
}
 
const assetBalancesQueries = MIRROR_ASSETS.map((item: ListedItem) => ({ token: item.token, ...generate(item) }))
const balanceQuery = gql`
query ${TOKEN_BALANCE} {
  ${assetBalancesQueries.map(alias)}
}
`;

let result = await request(networks.mainnet.mantle, balanceQuery);
let parsedData: Dictionary<{ balance: string; }> = parse(result);
let pairPool = await getPairPool();
let assetsTotal = '0';
let tokenBalances = MIRROR_ASSETS.reduce((tokenList, currentAsset) => {
 const priceKey = currentAsset.status === "LISTED" ? PriceKey.PAIR : PriceKey.END;
 const priceResult = price[priceKey](pairPool)[currentAsset.token];
 const balance = div(parsedData[currentAsset.token].balance, UNIT);
 const value = times(balance, priceResult ?? 0);
 assetsTotal = plus(assetsTotal,value);
  if(parsedData[currentAsset.token]?.balance !== "0") {
      tokenList.push({price: priceResult ?? 0, symbol: currentAsset.symbol, amount: balance, value,staked: null})
  }
  return tokenList;
}, []);
return {tokenBalances, assetsTotal};
}


export const getTokenBalance= async (address: string) => {
  let result = await getMirrorAssets(address);
  return result.tokenBalances;
};

export const getAssetsTotal= async (address: string) => {
  let mirrorTotal =  getMirrorAssets(address);
  let poolTotal =  getPoolTotal(address);
  let result = await Promise.all([mirrorTotal, poolTotal]);
  return {assetsTotal: result[0].assetsTotal, rewardsTotal: result[1].rewardsSum, poolTotal: result[1].poolSum, address};
}