import axios from "axios";
import { LCD_URL } from "../../utils";
import { plus } from "../../../../utils/math";
import { contracts } from "./contracts";
import { getMirrorPairStats } from "./mirrorPairStats";
import { getSpecPairStats } from "./specPairStats";
import { HEIGHT_PER_YEAR } from "./utils";



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

export const getPairStats = async (height,specPrice, mirrorPoolInfo, specPoolInfo, pairInfo,govConfig,govVaults) => {
    const mirrorStats = await getMirrorPairStats(mirrorPoolInfo, pairInfo, govConfig, govVaults);
    const specStats = await getSpecPairStats(specPoolInfo, pairInfo, govVaults);
    const pairStats: any = {...mirrorStats, ...specStats};
    const pairStatKeys = Object.keys(pairStats);
    const totalWeight = pairStatKeys.map(key => pairStats[key].multiplier).reduce((a, b) => a + b, 0);
    const specPerHeight = govConfig.mint_end > height ? govConfig.mint_per_block : '0';
    const ustPerYear = +specPerHeight * HEIGHT_PER_YEAR * +specPrice;
    let vaultFee = 0, tvl = '0';
    Object.values(pairStats).forEach((pair:any, index:number) => {
        pairStats[pairStatKeys[index]].specApr = pair.multiplier === 0 ? 0 : (ustPerYear * pair.multiplier / totalWeight / +pair.tvl) ?? 0;
        vaultFee += (pair.vaultFee ?? 0);
        tvl = plus(tvl, pair.tvl);
    });
    const stats = {pairs: pairStats, tvl, vaultFee};
    return stats;
}

export const getFarmInfos = async(height: number, specPrice: string) => {
   const {poolInfo, mirrorPoolInfo, specPoolInfo} = await getPoolInfos();
   const pairInfo = await getPairsInfo(poolInfo);
   const govConfig = await getGovConfig();
   const govVaults = await getGovVaults();
   const pairStats = await getPairStats(height, specPrice,mirrorPoolInfo, specPoolInfo, pairInfo, govConfig, govVaults)
}
