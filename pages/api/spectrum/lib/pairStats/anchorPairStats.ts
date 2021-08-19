import { contracts } from "../contracts";
import { getRewardInfos, getFarmConfig, createPairStats } from "../utils";
import { borrowAPYQuery } from "../../../anchor/lib/borrow";
import BigNumber from 'bignumber.js';

const ANCHOR_MANTLE = 'https://mantle.anchorprotocol.com';

export const getAnchorPairStats = async (height, poolInfos, govVaults, govConfig, terraSwapPoolResponses) => {
    const rewardInfo = await getRewardInfos(height, contracts.anchorFarm, contracts.anchorStaking);
    const farmConfig = await getFarmConfig(contracts.anchorFarm);
    const anchorApyStats = await borrowAPYQuery(ANCHOR_MANTLE);
    const terraSwapPool = terraSwapPoolResponses[contracts.anchorToken];
    const totalWeight = Object.values(poolInfos).reduce((a, b: any) => a + b.weight, 0);
    const govWeight = govVaults.vaults.find(it => it.address === contracts.anchorFarm)?.weight || 0;
    const poolApr = +(anchorApyStats?.lpRewards[0]?.APY || 0);

    const farmApr = (anchorApyStats?.govRewards[0]?.CurrentAPY || 0 );

    const pairs = {};
    pairs[contracts.anchorToken] = createPairStats(poolApr, contracts.anchorToken, poolInfos, govWeight, totalWeight, farmApr);
    
    const communityFeeRate = +farmConfig.community_fee * (1 - +govConfig.warchest_ratio);
    const uusd = terraSwapPool?.assets.find(a => a.info.native_token?.['denom'] === 'uusd');
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