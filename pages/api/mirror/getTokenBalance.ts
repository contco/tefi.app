import MIRROR_ASSETS from "./mirrorAssets.json";
import {gql} from "@apollo/client";
import {request} from "graphql-request";
import networks from "./networks";
import {alias, parse} from "./utils";

const TOKEN_BALANCE = "TokenBalance";



export const getTokenBalance= async (address: string) => {

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
  let tokenBalances = MIRROR_ASSETS.reduce((tokenList, currentAsset, index) => {
      if(parsedData[currentAsset.token]?.balance !== "0") {
          tokenList.push({price: 1.3, symbol: currentAsset.symbol, amount: parsedData[currentAsset.token].balance, staked: null})
      }
      return tokenList;
  }, []);

  return tokenBalances;
}