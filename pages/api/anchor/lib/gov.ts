import { client } from './test-defaults';
import { getLatestBlockHeight } from './utils';
import { gql } from '@apollo/client';
import { ContractAddresses } from './test-defaults';
import { mantleFetch } from './utils';
import { DEFAULT_MANTLE_ENDPOINTS } from '../../../../utils/ancEndpoints';

export const REWARDS_ANC_GOVERNANCE_REWARDS_QUERY = `
  query (
    $govContract: String!
    $govStakeInfoQuery: String!
    $ancContract: String!
    $userAncBalanceQuery: String!
  ) {
    userGovStakingInfo: WasmContractsContractAddressStore(ContractAddress: $govContract, QueryMsg: $govStakeInfoQuery) {
      Result
    }
    userANCBalance: WasmContractsContractAddressStore(ContractAddress: $ancContract, QueryMsg: $userAncBalanceQuery) {
      Result
    }
  }
`;

export const rewardsAncGovernanceRewardsQuery = async (mantleEndpoint, address) => {
  const rawData = await mantleFetch(
    REWARDS_ANC_GOVERNANCE_REWARDS_QUERY,
    {
      govContract: ContractAddresses['gov'],
      ancContract: ContractAddresses['cw20'],
      govStakeInfoQuery: JSON.stringify({
        staker: {
          address: address,
        },
      }),
      userAncBalanceQuery: JSON.stringify({
        balance: {
          address: address,
        },
      }),
    },
    `${mantleEndpoint}?rewards--anc-governance-rewards`,
  );

  return {
    userGovStakingInfo: JSON.parse(rawData?.userGovStakingInfo?.Result),
    userANCBalance: JSON.parse(rawData?.userANCBalance?.Result),
  };
};

export const getGovAPY = async () => {
  const height = await getLatestBlockHeight();
  const result = await client.query({
    query: gql`
      query AnchorGovRewards {
        AnchorGovRewardRecords(Height: ${height}) {
          CurrentAPY
        }
      }
    `,
  });

  const govAPY = result.data.AnchorGovRewardRecords[0]?.CurrentAPY;

  return govAPY;
};

export default async (address) => {
  const govApy = await getGovAPY();
  const govInfo = await rewardsAncGovernanceRewardsQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet'], address);

  const result = {
    reward: {
      name: 'ANC Gov',
      staked: parseFloat(govInfo?.userGovStakingInfo?.balance) / 1000000,
      apy: govApy,
    },
  };
  return result;
};
