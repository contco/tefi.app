import axios from "axios";
import { LCD_URL } from "../../utils";
import { getCoinInfos } from "./coinInfos";
import { contracts } from "./contracts";
import { getPairStats } from "./pairStats";
import { getRewardInfos } from "./rewardInfos";
import { getGovConfig, getGovState, getGovVaults } from "./gov";
import { calculateFarmInfos } from "./calculateFarmInfo";


const getPoolInfos = async () => {
  const mirrorPoolPromise = axios.get(LCD_URL + `wasm/contracts/${contracts.mirrorFarm}/store`, {
    params: {
      query_msg: JSON.stringify({
        pools: {}
      })
    },
  });
  const specPoolPromise = axios.get(LCD_URL + `wasm/contracts/${contracts.specFarm}/store`, {
    params: {
      query_msg: JSON.stringify({
        pools: {}
      })
    },
  });

  const [mirrorPool, specPool] = await Promise.all([mirrorPoolPromise, specPoolPromise]);


  const poolInfo = {};
  const mirrorPoolInfo = {};
  const specPoolInfo = {};

  specPool?.data?.result?.pools.forEach((pool) => {
    poolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Spectrum" });
    specPoolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Spectrum" });
  });

  mirrorPool?.data?.result?.pools.forEach((pool) => {
    poolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Mirror" });
    mirrorPoolInfo[pool?.asset_token] = Object.assign(pool, { farm: "Mirror" });
  })

  return { poolInfo, mirrorPoolInfo, specPoolInfo };

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

export const getFarmInfos = async (address: string, height: number, specPrice: string) => {
  const { poolInfo, mirrorPoolInfo, specPoolInfo } = await getPoolInfos();
  const [pairInfo, govConfig, govVaults, govState, coinInfos, pairRewardInfos] = await fetchFarmData(height, address, poolInfo);
  const pairStats = await getPairStats(height, specPrice, mirrorPoolInfo, specPoolInfo, pairInfo, govConfig, govVaults, govState);
  const poolResponses = await getPoolResponses(pairInfo);
  const { farmInfos, farmsTotal, rewardsTotal } = calculateFarmInfos(poolInfo, pairStats, pairRewardInfos, coinInfos, poolResponses, specPrice);
  return { farms: farmInfos, farmsTotal, rewardsTotal, govApr: pairStats.govApr };
}
