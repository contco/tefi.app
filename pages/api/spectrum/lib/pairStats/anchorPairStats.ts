import { contracts } from '../contracts';
import { getRewardInfos, getFarmConfig, createPairStats } from '../utils';
import BigNumber from 'bignumber.js';
import { getAnchorApyStats } from '../../../anchor/lib/getAncApyStats';

export const getAnchorPairStatsData = async (height) => {
  const rewardInfoPromise = getRewardInfos(height, contracts.anchorFarm, contracts.anchorStaking);
  const farmConfigPromise = getFarmConfig(contracts.anchorFarm);
  const anchorApyStatsPromise = getAnchorApyStats();
  const [rewardInfo, farmConfig, anchorApyStats] = await Promise.all([
    rewardInfoPromise,
    farmConfigPromise,
    anchorApyStatsPromise,
  ]);
  return { rewardInfo, farmConfig, anchorApyStats };
};

export const calculateAnchorPairStats = (
  anchorPairStatsData,
  poolInfos,
  govVaults,
  govConfig,
  terraSwapPoolResponses,
) => {
  const { rewardInfo, farmConfig, anchorApyStats } = anchorPairStatsData;
  const terraSwapPool = terraSwapPoolResponses[contracts.anchorToken];
  const totalWeight = Object.values(poolInfos).reduce((a, b: any) => a + b.weight, 0);
  const govWeight = govVaults.vaults.find((it) => it.address === contracts.anchorFarm)?.weight || 0;
  const poolApr = +(anchorApyStats?.lpRewardApy || 0);

  const farmApr = anchorApyStats?.govRewardApy || 0;

  const pairs = {};
  pairs[contracts.anchorToken] = createPairStats(
    poolApr,
    contracts.anchorToken,
    poolInfos,
    govWeight,
    totalWeight,
    farmApr,
  );

  const communityFeeRate = +farmConfig.community_fee * (1 - +govConfig.warchest_ratio);
  const uusd = terraSwapPool?.assets.find((a) => a.info.native_token?.['denom'] === 'uusd');
  if (!uusd) {
    return;
  }

  const pair = pairs[contracts.anchorToken];
  const value = new BigNumber(uusd.amount)
    .times(rewardInfo.bond_amount)
    .times(2)
    .div(terraSwapPool.total_share)
    .toString();
  pair.tvl = value;
  pair.vaultFee = +pair.tvl * pair.poolApr * communityFeeRate;
  pairs[contracts.anchorToken] = pair;

  return pairs;
};
