import { RewardsAncGovernanceRewardsData, rewardsAncGovernanceRewardsQuery } from '@anchor-protocol/webapp-fns';
import { useAnchorWebapp } from '@anchor-protocol/webapp-provider';
import { useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';

const queryFn = ({ queryKey: [, mantleEndpoint, mantleFetch, govContract, ancContract, address] }) => {
  return rewardsAncGovernanceRewardsQuery({
    mantleEndpoint,
    mantleFetch,
    variables: {
      govContract,
      ancContract,
      govStakeInfoQuery: {
        staker: {
          address: address,
        },
      },
      userAncBalanceQuery: {
        balance: {
          address: address,
        },
      },
    },
  });
};

export function useRewardsAncGovernanceRewardsQuery({
  address,
}: any): UseQueryResult<RewardsAncGovernanceRewardsData | undefined> {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const {
    contractAddress: { anchorToken, cw20 },
  } = useAnchorWebapp();

  const result = useQuery(
    ['ANCHOR_QUERY_REWARDS_ANC_GOVERNANCE_REWARDS', mantleEndpoint, mantleFetch, anchorToken.gov, cw20.ANC, address],
    queryFn,
  );

  return result;
}
