import axios from "axios";
import { LCD_URL } from "../../utils";
import { contracts } from "./contracts";
import { getPairStats } from "./pairStats";
import { getRewardInfos } from "./rewardInfos";


const getPoolInfos = async () => {
    const mirrorPoolPromise =  axios.get(LCD_URL + `wasm/contracts/${contracts.mirrorFarm}/store`, {
        params: {
          query_msg: JSON.stringify({
            pools: {}
          })
       },
    });
    const specPoolPromise =  axios.get(LCD_URL + `wasm/contracts/${contracts.specFarm}/store`, {
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
        poolInfo[pool?.asset_token] =  Object.assign(pool, { farm: "Spectrum" });
        specPoolInfo[pool?.asset_token] =  Object.assign(pool, { farm: "Spectrum" });
   });
  
     mirrorPool?.data?.result?.pools.forEach((pool) => {
        poolInfo[pool?.asset_token] =  Object.assign(pool, { farm: "Mirror" });
        mirrorPoolInfo[pool?.asset_token] =  Object.assign(pool, { farm: "Mirror" });
    })

    return {poolInfo, mirrorPoolInfo, specPoolInfo};

}

export const getPairsInfo = async (poolInfo: any ) => {
    const list = Object.keys(poolInfo);
    const pairsInfo = {};
    const tasks = list.map(async (key) => {
        const pairInfo =  await axios.get(LCD_URL + `wasm/contracts/${contracts.terraSwapFactory}/store`, {
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


export const getFarmInfos = async(address: string, height: number, specPrice: string) => {
   const {poolInfo, mirrorPoolInfo, specPoolInfo} = await getPoolInfos();
   const pairInfo = await getPairsInfo(poolInfo);
   const govConfig = await getGovConfig();
   const govVaults = await getGovVaults();
   const pairStats = await getPairStats(height, specPrice,mirrorPoolInfo, specPoolInfo, pairInfo, govConfig, govVaults);
   const pairRewardInfos = await getRewardInfos(address, height);
}
