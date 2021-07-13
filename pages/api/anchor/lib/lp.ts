/* eslint-disable no-console */
import { ContractAddresses } from './test-defaults';
import { getLatestBlockHeight, mantleFetch } from './utils';
import { DEFAULT_MANTLE_ENDPOINTS } from '../../../../utils/ancEndpoints';
import big from 'big.js';
import { ancPriceQuery } from './ancPrice';
import { formatLP, MICRO } from '@anchor-protocol/notation';
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
  const poolPromise =  rewardsClaimableAncUstLpRewardsQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet'], address);
  const ancDataPromise =  ancPriceQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet']);
  const rewardsApyPromise =  borrowAPYQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet']);
   
  const [pool, ancData, rewardsApy] = await Promise.all([poolPromise, ancDataPromise, rewardsApyPromise]);

  if (pool?.lPStakerInfo?.bond_amount != '0' || pool?.lPBalance?.balance != '0') {
    const symbol = 'ANC';
    const lpName = 'ANC-UST LP';
    const apy = rewardsApy?.lpRewards[0]?.APY ?? '0';
    const availableLP = parseFloat(pool?.lPBalance?.balance) / MICRO;
    const stakedLP = parseFloat(pool?.lPStakerInfo?.bond_amount) / MICRO;
    const lpValue = formatLP(big(ancData?.ancPrice?.USTPoolSize)
    ?.div(ancData?.ancPrice?.LPShare === '0' ? 1 : ancData?.ancPrice?.LPShare)
    ?.mul(2));
    const ustStaked = (stakedLP / 2 ) * parseFloat(lpValue);
    const tokenStaked = ustStaked / ancData?.ancPrice?.ANCPrice;
    const ustUnStaked = (availableLP / 2 ) * parseFloat(lpValue);
    const tokenUnStaked = ustUnStaked / ancData?.ancPrice?.ANCPrice;
    const stakedLpUstValue = stakedLP * parseFloat(lpValue);
    const availableLpUstValue = availableLP * parseFloat(lpValue);
    const rewards = parseFloat(pool?.lPStakerInfo?.pending_reward) / MICRO;
    const rewardsValue = rewards * ancData?.ancPrice?.ANCPrice;
    const poolData =  [{symbol, lpName, apy, availableLP: availableLP.toString(), stakedLP: stakedLP.toString(), ustStaked: ustStaked.toString(), ustUnStaked: ustUnStaked.toString(), tokenStaked: tokenStaked.toString(), tokenUnStaked: tokenUnStaked.toString(), stakedLpUstValue: stakedLpUstValue.toString(), availableLpUstValue: availableLpUstValue.toString(), rewards: rewards.toString(), rewardsValue: rewardsValue.toString(), rewardsSymbol: symbol}];
    const anchorPoolSum = (stakedLpUstValue + availableLpUstValue).toString();
    const anchorRewardsSum = rewardsValue.toString();
    return {poolData, anchorPoolSum, anchorRewardsSum};
  }
  return {poolData: [], anchorPoolSum: '0', anchorRewardsSum: '0'};
}
