import axios from "axios";
import { LCD_URL } from "../../utils";
import { contracts } from "./contracts";
import{ getMirrorPairStats} from "./mirrorPairStats";


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


export const getPairStats = (mirrorPoolInfo, specPoolInfo, pairInfo) => {
   const mirrorStats = getMirrorPairStats(mirrorPoolInfo, pairInfo);
}

export const getFarmInfos = async() => {

   const {poolInfo, mirrorPoolInfo, specPoolInfo} = await getPoolInfos();
   const pairInfo = await getPairsInfo(poolInfo);
   const pairStats = await getPairStats(mirrorPoolInfo, specPoolInfo, pairInfo)
  
}
