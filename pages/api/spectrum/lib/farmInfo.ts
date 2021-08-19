import axios from "axios";
import { LCD_URL } from "../../utils";
import { getCoinInfos } from "./coinInfos";
import { contracts } from "./contracts";
import { getPairStats } from "./pairStats";
import { getRewardInfos } from "./rewardInfos";
import { getGovConfig, getGovState, getGovVaults } from "./gov";
import { calculateFarmInfos } from "./calculateFarmInfo";
import { getLatestBlockHeight} from "../../utils";
import { getPrice } from "../../commons";

const fetchSpecFarmInfo = async (pool_addr: string) => {
  const { data } = await axios.get(LCD_URL + `wasm/contracts/${pool_addr}/store`, {
    params: {
      query_msg: JSON.stringify({
        pools: {}
      })
    },
  });

  return data?.result;
};


export const getPoolInfos = async () => {
  const mirrorPoolPromise = fetchSpecFarmInfo(contracts.mirrorFarm);
  const specPoolPromise = fetchSpecFarmInfo(contracts.specFarm);
  const pylonPoolPromise = fetchSpecFarmInfo(contracts.pylonFarm);
  const anchorPoolPromise = fetchSpecFarmInfo(contracts.anchorFarm)

  const [mirrorPool, specPool, pylonPool, anchorPool] = await Promise.all([mirrorPoolPromise, specPoolPromise, pylonPoolPromise, anchorPoolPromise ]);


  const poolInfo = {};
  const mirrorPoolInfo = {};
  const specPoolInfo = {};
  const pylonPoolInfo = {};
  const anchorPoolInfo = {};

  specPool?.pools.forEach((pool) => {
    poolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Spectrum" });
    specPoolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Spectrum" });
  });

  mirrorPool.pools.forEach((pool) => {
    poolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Mirror" });
    mirrorPoolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Mirror" });
  });

  pylonPool.pools.forEach((pool) => {
    poolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Pylon" });
    pylonPoolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Pylon" });
  });

  anchorPool.pools.forEach((pool) => {
    poolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Anchor" });
    anchorPoolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Anchor" });
  });

  return { poolInfo, mirrorPoolInfo, specPoolInfo, pylonPoolInfo, anchorPoolInfo};

}

export const getPairsInfo = async (poolInfo: any) => {
  const list = Object.keys(poolInfo);
  const pairsInfo = {};
  const tasks = list.map(async (key) => {
    const pairInfo = await axios.get(LCD_URL + `wasm/contracts/${contracts.terraSwapFactory}/store`, {
      params: {
        query_msg: JSON.stringify({
          pair: {
            asset_infos: [
              { token: { contract_addr: key } },
              { native_token: { denom: 'uusd' } }
            ]
          }
        })
      },
    });
    pairsInfo[key] = pairInfo?.data?.result;
    return pairInfo;
  });
  await Promise.all(tasks);
  return pairsInfo;
};

const fetchPoolResponseData = async (address: string) => {
  const { data } = await axios.get(LCD_URL + `wasm/contracts/${address}/store`, {
    params: {
      query_msg: JSON.stringify({
        pool: {}
      })
    },
  });
  return data?.result;
}

const getPoolResponses = async (pairInfo) => {
  const poolResponses = {};
  const tasks = Object.keys(pairInfo).map(async (key) => {
    const data = await fetchPoolResponseData(pairInfo[key].contract_addr);
    poolResponses[key] = data;
  });
  await Promise.all(tasks);
  return poolResponses;
}

const fetchFarmData = async (height, address, poolInfo) => {
  const pairInfo = getPairsInfo(poolInfo);
  const govConfig = getGovConfig();
  const govVaults = getGovVaults();
  const govState = getGovState(height);
  const coinInfos = getCoinInfos(poolInfo);
  const pairRewardInfos = getRewardInfos(address, height);
  const result = await Promise.all([pairInfo, govConfig, govVaults, govState, coinInfos, pairRewardInfos]);
  return result;
}

export const getFarmInfos = async (address: string) => {
  try {
  const [poolData, height] = await Promise.all([getPoolInfos(), getLatestBlockHeight()]);
  
  const { poolInfo, mirrorPoolInfo, specPoolInfo, pylonPoolInfo, anchorPoolInfo} = poolData;

  const [pairInfo, govConfig, govVaults, govState, coinInfos, pairRewardInfos] = await fetchFarmData(height, address, poolInfo);
  const terraSwapPoolResponses = await getPoolResponses(pairInfo);
  const specPrice = getPrice(terraSwapPoolResponses[contracts.specToken]);
  const pairStats = await getPairStats(height, specPrice, mirrorPoolInfo, specPoolInfo, pairInfo, govConfig, govVaults, govState, pylonPoolInfo, anchorPoolInfo, terraSwapPoolResponses);


  const { farmInfos, farmsTotal, rewardsTotal } = calculateFarmInfos(poolInfo, pairStats, pairRewardInfos, coinInfos, terraSwapPoolResponses);
  return { farms: farmInfos, farmsTotal, rewardsTotal, govApr: pairStats.govApr };
  }
  catch(err){
    return {farms: [], farmsTotal: '0', rewardsTotal: '0', govApr: 0 }
  }
}
