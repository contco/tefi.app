import MIRROR_ASSETS from "./mirrorAssets.json";
import {gql} from "@apollo/client";
import {request} from "graphql-request";
import networks from "./networks";
import {alias, parse} from "./utils";

const PAIR_POOL = "PairPool";


export const getLpTokenBalance = async (address: string): Promise<Dictionary<Balance>>=> {
    const generate = ({ lpToken }: ListedItem) => {
        return { contract: lpToken, msg: { balance: { address } } }
    };
    const contractAssets = MIRROR_ASSETS.map((item: ListedItem) => ({ token: item.token, ...generate(item) }))
    const contractQuery = gql`
    query ${PAIR_POOL} {
      ${contractAssets.map(alias)}
    }
  `
  let result = await request(networks.mainnet.mantle, contractQuery);
  let parsedData: Dictionary<Balance> = parse(result);
  return parsedData;
}