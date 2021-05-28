import MIRROR_ASSETS from "./mirrorAssets.json";
import {gql} from "@apollo/client";
import {request} from "graphql-request";
import networks from "./networks";
import {alias} from "./utils";

const PAIR_POOL = "PairPool";

const generate = ({ token, pair }: ListedItem) => {
    return { token, contract: pair, msg: { pool: {} } }
}

export const getContractPoolData = async () => {
    const contractAssets = MIRROR_ASSETS.map((item: ListedItem) => ({ token: item.token, ...generate(item) }))
    const contractQuery = gql`
    query ${PAIR_POOL} {
      ${contractAssets.map(alias)}
    }
  `
  let result = await request(networks.mainnet.mantle, contractQuery);
  console.log(result);

}