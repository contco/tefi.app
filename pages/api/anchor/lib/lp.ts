/* eslint-disable no-console */
import { anchor, client, ContractAddresses } from './test-defaults';
import { getLatestBlockHeight, mantleFetch } from './utils';
import { gql } from '@apollo/client';

export const REWARDS_CLAIMABLE_ANC_UST_LP_REWARDS_QUERY = `
  query (
    $ancUstLpContract: String!
    $ancUstLpBalanceQuery: String!
    $ancUstLpStakingContract: String!
    $lPStakerInfoQuery: String!
  ) {
    lPBalance: WasmContractsContractAddressStore(
      ContractAddress: $ancUstLpContract
      QueryMsg: $ancUstLpBalanceQuery
    ) {
      Result
    }
    lPStakerInfo: WasmContractsContractAddressStore(
      ContractAddress: $ancUstLpStakingContract
      QueryMsg: $lPStakerInfoQuery
    ) {
      Result
    }
  }
`;

export const getLPBalance = async ({ address }: any) => {
  const result = await anchor.anchorToken.getLPBalance(address);
  return result;
};

export const stakedLP = async ({ address }: any) => {
  const result = await anchor.anchorToken.getProvidedLP(address);
  return result;
};

export const getLpAPY = async () => {
  const height = await getLatestBlockHeight();
  const result = await client.query({
    query: gql`
      query AnchorLPRewards {
        AnchorLPRewards(Height: ${height}) {
          APY
        }
      }
    `,
  });

  const APY = result.data.AnchorLPRewards[0]?.APY;
  return APY;
};

export async function rewardsClaimableAncUstLpRewardsQuery(mantleEndpoint, address) {
  const blockHeight = await getLatestBlockHeight();

  const rawData = await mantleFetch(
    REWARDS_CLAIMABLE_ANC_UST_LP_REWARDS_QUERY,
    {
      ancUstLpContract: ContractAddresses['ancUstLP'],
      ancUstLpStakingContract: ContractAddresses['staking'],
      ancUstLpBalanceQuery: JSON.stringify({
        balance: {
          address: address,
        },
      }),
      lPStakerInfoQuery: JSON.stringify({
        staker_info: {
          staker: address,
          block_height: blockHeight - 1,
        },
      }),
    },
    `${mantleEndpoint}?rewards--claimable-anc-ust-lp-rewards`,
  );

  return {
    lPBalance: JSON.parse(rawData?.lPBalance?.Result),
    lPStakerInfo: JSON.parse(rawData?.lPStakerInfo?.Result),
  };
}

export default async (address) => {
  const balance = await getLPBalance({ address });
  const staked = await stakedLP({ address });
  const lpAPY = await getLpAPY();

  const result = {
    reward: {
      name: 'ANC-LP',
      staked: staked,
      apy: lpAPY,
    },
    balance: balance,
  };

  return result;
};
