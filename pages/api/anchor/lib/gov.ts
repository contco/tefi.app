import { ContractAddresses } from './test-defaults';
import { mantleFetch } from './utils';
import { DEFAULT_MANTLE_ENDPOINTS } from '../../../../utils/ancEndpoints';
import { formatRate } from '@anchor-protocol/notation';
import { borrowAPYQuery } from './borrow';
import { ancPriceQuery } from './ancPrice';

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

export default async (address) => {
  const govInfo = await rewardsAncGovernanceRewardsQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet'], address);
  const allRewards = await borrowAPYQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet']);
  const staked =
    parseFloat(govInfo?.userGovStakingInfo?.balance) > 0
      ? parseFloat(govInfo?.userGovStakingInfo?.balance)/1000000
      : null;
  const ancData = await ancPriceQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet']);

  const stakedValue = parseFloat(staked.toString()) * parseFloat(ancData?.ancPrice?.ANCPrice);

  const result = {
    reward: {
      name: 'ANC Gov',
      staked: staked.toString(),
      apy: formatRate(allRewards?.govRewards[0]?.CurrentAPY),
    },
    value: stakedValue.toString()
  };
  return result;
};
