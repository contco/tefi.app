/* eslint-disable no-console */
import { ContractAddresses } from './test-defaults';
import { getLatestBlockHeight, mantleFetch, MICRO } from './utils';
import big from 'big.js';
import { ancPriceQuery } from './ancPrice';
import { getAnchorApyStats } from './getAncApyStats';
import { MANTLE_URL } from '../../utils';


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


export const rewardsClaimableAncUstLpRewardsQuery = async (mantleEndpoint, address) => {
  try {
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
  } catch (err) {
    rewardsClaimableAncUstLpRewardsQuery(mantleEndpoint, address);
  }
};

export const getAncPoolData = async (address) => {
  try {
    const poolPromise = rewardsClaimableAncUstLpRewardsQuery(MANTLE_URL, address);
    const ancDataPromise = ancPriceQuery(MANTLE_URL);
    const rewardsApyPromise = getAnchorApyStats();

    const [pool, ancData, rewardsApy] = await Promise.all([poolPromise, ancDataPromise, rewardsApyPromise]);
    if (pool && (pool?.lPStakerInfo?.bond_amount != '0' || pool?.lPBalance?.balance != '0')) {
      const symbol1 = 'UST';
      const symbol2 = 'ANC';
      const lpName = 'ANC-UST LP';
      const apy = rewardsApy?.lpRewardApy
      const stakeableLp = parseFloat(pool?.lPBalance?.balance) / MICRO;
      const stakedLp = parseFloat(pool?.lPStakerInfo?.bond_amount) / MICRO;
      const lpValue = big(ancData?.ancPrice?.USTPoolSize)
        ?.div(ancData?.ancPrice?.LPShare === '0' ? 1 : ancData?.ancPrice?.LPShare)
        ?.mul(2);
      const token1Staked = (stakedLp / 2) * parseFloat(lpValue);
      const token2Staked = token1Staked / ancData?.ancPrice?.ANCPrice;
      const token1UnStaked = (stakeableLp / 2) * parseFloat(lpValue);
      const token2UnStaked = token1UnStaked / ancData?.ancPrice?.ANCPrice;
      const stakedLpUstValue = stakedLp * parseFloat(lpValue);
      const stakeableLpUstValue = stakeableLp * parseFloat(lpValue);
      const totalLpUstValue = (stakedLpUstValue + stakeableLpUstValue).toString();
      const rewards = parseFloat(pool?.lPStakerInfo?.pending_reward) / MICRO;
      const rewardsValue = rewards * ancData?.ancPrice?.ANCPrice;

      const poolData = [{ symbol1, symbol2, lpName, apr: apy, stakeableLp: stakeableLp.toString(), stakedLp: stakedLp.toString(), totalLpUstValue, token1Staked: token1Staked.toString(), token1UnStaked: token1UnStaked.toString(), token2Staked: token2Staked.toString(), token2UnStaked: token2UnStaked.toString(), stakedLpUstValue: stakedLpUstValue.toString(), stakeableLpUstValue: stakeableLpUstValue.toString(), rewards: rewards.toString(), rewardsValue: rewardsValue.toString(), rewardsSymbol: symbol2 }];
      const anchorRewardsSum = rewardsValue.toString();
      return { poolData, anchorPoolSum: totalLpUstValue, anchorRewardsSum };
    }
    return { poolData: [], anchorPoolSum: '0', anchorRewardsSum: '0' };
  }
  catch (err) {
    return { poolData: [], anchorPoolSum: '0', anchorRewardsSum: '0' };
  }
}
