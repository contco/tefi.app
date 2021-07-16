import axios from "axios";
import { request, gql } from 'graphql-request';
import { LCD_URL } from "../../utils";
import { contracts } from "./contracts";
import networks from "../../../../utils/networks";
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

function fromEntries<T>(entries: [string, T][]) {
    return entries.reduce((a, [k, v]) => (a[k] = v, a), {} as Record<string, T>);
}



const getGovConfig = async () => {
    const {data: govConfig} =  await axios.get(LCD_URL + `wasm/contracts/${contracts.gov}/store`, {
        params: {
          query_msg: JSON.stringify({
            config: {}
          })
       },
    });
   return govConfig?.result;
}

const getGovVaults = async () => {
    const {data: govVaults} =  await axios.get(LCD_URL + `wasm/contracts/${contracts.gov}/store`, {
        params: {
          query_msg: JSON.stringify({
            vaults: {}
          })
       },
    });
   return govVaults?.result;
}

const getFarmConfig = async () => {
    const {data: farmConfig} =  await axios.get(LCD_URL + `wasm/contracts/${contracts.mirrorFarm}/store`, {
        params: {
          query_msg: JSON.stringify({
            config: {}
          })
       },
    });
   return farmConfig?.result;
}

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

const getPairPool = async(contract: string) => {
    const {data: pairPool} =  await axios.get(LCD_URL + `wasm/contracts/${contract}/store`, {
        params: {
          query_msg: JSON.stringify({
            pool: {}
          })
       },
    });
   return pairPool?.result;
}

const createPairStats = (poolApr, token, poolInfos, govWeight, totalWeight, govStats) => {
    const poolInfo = poolInfos[token];
    const stat = {
      poolApr,
      poolApy: (poolApr / 365 + 1) ** 365 - 1,
      farmApr: govStats.statistic.govAPR,
      tvl: '0',
      multiplier: poolInfo ? govWeight * poolInfo.weight / totalWeight : 0,
      vaultFee: 0,
    };
    return stat;
}

const getPairs = (assetStats: any, poolInfo, govWeight, totalWeight, govStats) => {
    const pairs = {}; 
    for(const asset of assetStats?.assets) {
      const poolApr = +(asset.statistic.apr?.long || 0);
      pairs[asset?.token] = createPairStats(poolApr, asset.token, poolInfo, govWeight, totalWeight, govStats);
    }
    return pairs;
}

export const getMirrorPairStats = async (pool, poolPairs) => {
    const rewardInfos = await getRewardInfos();
    const govStats = await request(networks.mainnet.stats, GOV_STAT_QUERY, {network: 'TERRA'});
    const assetStats = await request(networks.mainnet.stats, ASSET_STATS_QUERY);
    const govConfig = await getGovConfig();
    const govVaults = await getGovVaults();
    const farmConfig = await getFarmConfig();
    const poolInfos = fromEntries(Object.entries(pool));
    const totalWeight = Object.values(poolInfos).reduce((a, b: any) => a + b.weight, 0);
    const govWeight = govVaults.vaults.find(vault => vault.address === contracts.mirrorFarm)?.weight || 0;
    const communityFeeRate = +farmConfig.community_fee * (1 - +govConfig.warchest_ratio);
     
    const pairs = getPairs(assetStats, poolInfos , govWeight, totalWeight, govStats);

    const pairStatsTasks= rewardInfos.reward_infos.map(async(item: any) => {
     const pairPool = await getPairPool(poolPairs[item?.asset_token].contract_addr);
     const uusd = pairPool.assets.find(a => a.info.native_token?.['denom'] === 'uusd');
      if (!uusd) {
        return;
      }
      const pair = (pairs[item.asset_token] || (pairs[item.asset_token] = createPairStats(0, item.asset_token,poolInfos , govWeight, totalWeight, govStats)));
      const value = new BigNumber(uusd.amount)
      .times(item.bond_amount)
      .times(2)
      .div(pairPool.total_share)
      .toString();
      pair.tvl = value;
      pair.vaultFee = +pair.tvl * pair.poolApr * communityFeeRate;
      pairs[item?.asset_token] = pair;
     
      return pairPool;
    });

    await Promise.all(pairStatsTasks);
    return pairs;
};