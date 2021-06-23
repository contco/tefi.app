/* eslint-disable no-console */
import { anchor,  ContractAddresses } from './test-defaults';
import { getLatestBlockHeight, mantleFetch } from './utils';
import { DEFAULT_MANTLE_ENDPOINTS } from '../../../../utils/ancEndpoints';
import big from 'big.js';
import { ancPriceQuery } from './ancPrice';
import { demicrofy, formatANCWithPostfixUnits, formatRate, formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { borrowAPYQuery } from './borrow';

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

export const rewardsClaimableAncUstLpRewardsQuery = async (mantleEndpoint, address) => {
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
};

export const getAncUstLp = async (address) => {
  const balance = await anchor.anchorToken.getLPBalance(address);
  const pool = await rewardsClaimableAncUstLpRewardsQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet'], address);
  const ancData = await ancPriceQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet']);

  const totalUserLPHolding = big(balance).plus(pool.lPStakerInfo.bond_amount);
  const LPValue = big(ancData?.ancPrice?.USTPoolSize)
    ?.div(ancData?.ancPrice?.LPShare === '0' ? 1 : ancData?.ancPrice?.LPShare)
    ?.mul(2);

  const withdrawableAssets = {
    anc: big(ancData?.ancPrice?.ANCPoolSize)
      ?.mul(totalUserLPHolding)
      .div(ancData?.ancPrice?.LPShare === '0' ? 1 : ancData?.ancPrice?.LPShare),
    ust: big(ancData?.ancPrice?.USTPoolSize)
      ?.mul(totalUserLPHolding)
      .div(ancData?.ancPrice?.LPShare === '0' ? 1 : ancData?.ancPrice?.LPShare),
  };

  const staked = pool.lPStakerInfo.bond_amount;
  const stakedValue = big(staked)?.mul(LPValue);

  return {
    withdrawableAssets,
    stakedValue,
  };
};

export default async (address) => {
  const balance = await getLPBalance({ address });
  const staked = await stakedLP({ address });
  const allRewards = await borrowAPYQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet']);
  const rewards = await rewardsClaimableAncUstLpRewardsQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet'], address);
  const ancUstLPData = await getAncUstLp(address);

  const result = {
    reward: {
      name: 'ANC-LP',
      staked: parseFloat(staked) > 0 ? staked : null,
      apy: formatRate(allRewards?.lpRewards[0]?.APY),
      reward: formatUSTWithPostfixUnits(demicrofy(rewards?.lPStakerInfo?.pending_reward)),
    },
    balance: balance,
    value: formatUSTWithPostfixUnits(demicrofy(ancUstLPData.stakedValue)),
    anc: formatANCWithPostfixUnits(demicrofy(ancUstLPData.withdrawableAssets.anc)),
    ust: formatUSTWithPostfixUnits(demicrofy(ancUstLPData.withdrawableAssets.ust)),
  };

  return result;
};
