import newtworks from "./networks";
import MIRROR_ASSETS from "./mirrorAssets.json";
import {gql} from "@apollo/client";
import {request} from "graphql-request";
import networks from "./networks";

const PAIR_POOL = "PairPool";
const WASMQUERY = "WasmContractsContractAddressStore"


interface Query extends Partial<ContractVariables> {
  token: string
}

const stringify = (msg: object) => JSON.stringify(msg).replace(/"/g, '\\"');

const alias = ({ token, contract, msg }: Query) =>
  !msg
    ? ``
    : `
    ${token}: ${WASMQUERY}(
      ContractAddress: "${contract}"
      QueryMsg: "${stringify(msg)}"
    ) {
      Height
      Result
    }`

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