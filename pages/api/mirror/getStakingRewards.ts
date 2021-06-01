import {gql} from "@apollo/client";
import {request} from "graphql-request";
import networks from "./networks";
import { parse} from "./utils";

const STAKING_CONTRACT = "terra17f7zu97865jmknk7p2glqvxzhduk78772ezac5";
const STAKING_CONTRACT_NAME = "StakingReward";
const GET_CONTRACT = (name: string) => gql`
query ${name} ($contract: String, $msg: String) {
  WasmContractsContractAddressStore(
    ContractAddress: $contract
    QueryMsg: $msg
  ) {
    Height
    Result
  }
}
`


export const getStakingRewards = async (address: string) => {
    const variables = { contract: STAKING_CONTRACT, msg: JSON.stringify({ reward_info: { staker: address } }) }
    const contractQuery = GET_CONTRACT(STAKING_CONTRACT_NAME)
    let result = await request(networks.mainnet.mantle, contractQuery, variables);
    let parsedData: Dictionary<PairPool> & Dictionary<MintInfo> = parse(result);
    return parsedData;

}