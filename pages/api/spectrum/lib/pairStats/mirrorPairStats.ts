import axios from "axios";
import { request, gql } from 'graphql-request';
import { LCD_URL } from "../../../utils";
import { contracts } from "../contracts";
import { fromEntries, createPairStats, getFarmConfig } from "../utils";
import networks from "../../../../../utils/networks";
import BigNumber from 'bignumber.js';

const GOV_STAT_QUERY = gql`
query statistic($network: Network) {
    statistic(network: $network) {
      govAPR
    }
  }
`;

const ASSET_STATS_QUERY = gql`
query assets {
    assets {
      token
      statistic {
        apr { long }
      }
    }
  }
`;


const getRewardInfos = async () =>  {
    const {data: rewardInfos} =  await axios.get(LCD_URL + `wasm/contracts/${contracts.mirrorStaking}/store`, {
        params: {
          query_msg: JSON.stringify({
            reward_info: {
                staker_addr: contracts.mirrorFarm,
            }
          })
       },
    });
    return rewardInfos?.result;
}


const getPairs = (assetStats: any, poolInfo, govWeight, totalWeight, farmApr) => {
    const pairs = {}; 
    for(const asset of assetStats?.assets) {
      const poolApr = +(asset.statistic.apr?.long || 0);
      pairs[asset?.token] = createPairStats(poolApr, asset.token, poolInfo, govWeight, totalWeight, farmApr);
    }
    return pairs;
}

export const getMirrorPairStatsData = async () => {
  const rewardInfoPromise = getRewardInfos();
  const farmConfigPromise = getFarmConfig(contracts.mirrorFarm);
  const govStatsPromise = request(networks.mainnet.stats, GOV_STAT_QUERY, {network: 'TERRA'});
  const assetStatsPromise =  request(networks.mainnet.stats, ASSET_STATS_QUERY);
  const [rewardInfos, farmConfig, govStats, assetStats] = await Promise.all([rewardInfoPromise, farmConfigPromise, govStatsPromise, assetStatsPromise]);
  return {rewardInfos, farmConfig, govStats, assetStats};
}


export const calculateMirrorPairStats =  (mirrorData, pool, govConfig, govVaults, terraSwapPoolResponses) => {
    const {rewardInfos, farmConfig, govStats, assetStats} = mirrorData;
    const poolInfos = fromEntries(Object.entries(pool));
    const totalWeight = Object.values(poolInfos).reduce((a, b: any) => a + b.weight, 0);
    const govWeight = govVaults.vaults.find(vault => vault.address === contracts.mirrorFarm)?.weight || 0;
    const communityFeeRate = +farmConfig.community_fee * (1 - +govConfig.warchest_ratio);
    const farmApr = (govStats.statistic.govAPR || 0 );
    const pairStats = getPairs(assetStats, poolInfos , govWeight, totalWeight, farmApr);


    rewardInfos.reward_infos.forEach((item: any) => {
     const pairPool = terraSwapPoolResponses[item?.asset_token];
     const uusd = pairPool.assets.find(a => a.info.native_token?.['denom'] === 'uusd');
      if (!uusd) {
        return;
      }
      const pair = (pairStats[item.asset_token] || (pairStats[item.asset_token] = createPairStats(0, item.asset_token,poolInfos , govWeight, totalWeight, govStats)));
      const value = new BigNumber(uusd.amount)
      .times(item.bond_amount)
      .times(2)
      .div(pairPool.total_share)
      .toString();
      pair.tvl = value;
      pair.vaultFee = +pair.tvl * pair.poolApr * communityFeeRate;
      pairStats[item?.asset_token] = pair;
     
      return pairPool;
    });

    return pairStats;
};