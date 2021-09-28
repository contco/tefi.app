import { gql } from '@apollo/client';
import { request } from 'graphql-request';
import networks from '../../../utils/networks';
import { parseContractsData, STAKING_CONTRACT } from './utils';

const STAKING_CONTRACT_NAME = 'StakingReward';

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
`;

export const getStakingRewards = async (address: string): Promise<StakingReward> => {
  try {
  const variables = { contract: STAKING_CONTRACT, msg: JSON.stringify({ reward_info: { staker_addr: address } }) };
  const contractQuery = GET_CONTRACT(STAKING_CONTRACT_NAME);
  const result = await request(networks.mainnet.mantle, contractQuery, variables);
  const parsedData: StakingReward = parseContractsData(result);
  return parsedData;
  }
  catch(err){
    return null;
  }
};
