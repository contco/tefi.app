import { contracts } from "../contracts";
import { createPairStats, getFarmConfig, getRewardInfos } from "../utils";
import { fetchData } from "../../../commons";
import { PYLON_API_ENDPOINT } from "../../../pylon/constants";
import BigNumber from 'bignumber.js';


const getPylonApy = async () => {
  const [govData ,lpData] = await Promise.all([fetchData(PYLON_API_ENDPOINT+'governance/v1/overview'), fetchData(PYLON_API_ENDPOINT+'liquidity/v1/overview')]);
  const govApy =  govData?.data?.apy ? govData?.data?.apy.toString() : '0';
  const lpApy = lpData?.data?.apy;
  return {govApy, lpApy};
}

export const getPylonPairStats = async (height, poolInfos, govVaults, govConfig, terraSwapPoolResponses ) => {
    const rewardInfo = await getRewardInfos(height, contracts.pylonFarm, contracts.pylonStaking);
    const farmConfig = await getFarmConfig(contracts.pylonFarm);
    const {govApy, lpApy} = await getPylonApy();
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