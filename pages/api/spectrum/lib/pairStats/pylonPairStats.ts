import { contracts } from "../contracts";
import { createPairStats, getFarmConfig, getRewardInfos } from "../utils";
import { fetchData } from "../../../commons";
import { PYLON_API_ENDPOINT } from "../../../pylon/constants";
import BigNumber from 'bignumber.js';


export const getPylonPairStatsData = async (height) => {
  try {
    const rewardInfoPromise = getRewardInfos(height, contracts.pylonFarm, contracts.pylonStaking);
    const farmConfigPromise =  getFarmConfig(contracts.pylonFarm);
    const pylonApyPromise = getPylonApy();
    const [rewardInfo, farmConfig, pylonApy] = await Promise.all([rewardInfoPromise, farmConfigPromise, pylonApyPromise]);
    return {rewardInfo, farmConfig, ...pylonApy};
  }
  catch(err) {
    return {rewardInfo: {bond_amount: '0'}, farmConfig: {community_fee: "0"},  govLpy: '0', lpApy: '0' }
  }
}

const getPylonApy = async () => {
  try {
    const [govData ,lpData] = await Promise.all([fetchData(PYLON_API_ENDPOINT+'governance/v1/overview'), fetchData(PYLON_API_ENDPOINT+'liquidity/v1/overview')]);
    const govApy =  govData?.data?.apy ? govData?.data?.apy.toString() : '0';
    const lpApy = lpData?.data?.apy;
    return {govApy, lpApy};
  }
  catch(err) {
    return {govApy: '0', lpApy: '0'};
  }
}

export const calculatePylonPairStats = (pylonStatsData, poolInfos, govVaults, govConfig, terraSwapPoolResponses ) => {
    const {rewardInfo, farmConfig, govApy, lpApy} = pylonStatsData;
    const terraSwapPool = terraSwapPoolResponses[contracts.pylonToken];
    const poolApr = +(lpApy || 0);

    const totalWeight = Object.values(poolInfos).reduce((a, b: any) => a + b.weight, 0);
    const govWeight = govVaults.vaults.find(vault => vault.address === contracts.pylonFarm)?.weight || 0;
    const pairs = {};
    pairs[contracts.pylonToken] = createPairStats(poolApr, contracts.pylonToken, poolInfos, govWeight, totalWeight, govApy );


    const communityFeeRate = +farmConfig.community_fee * (1 - +govConfig.warchest_ratio);
    const uusd = terraSwapPool?.assets.find(a => a.info.native_token?.['denom'] === 'uusd');
    if (!uusd) {
      return;
    }
    const pair = pairs[contracts.pylonToken];
    const value = new BigNumber(uusd.amount)
      .times(rewardInfo.bond_amount)
      .times(2)
      .div(terraSwapPool.total_share)
      .toString();
    pair.tvl = value;
    pair.vaultFee = +pair.tvl * pair.poolApr * communityFeeRate;
    pairs[contracts.pylonToken] = pair;
    
    return pairs;
};