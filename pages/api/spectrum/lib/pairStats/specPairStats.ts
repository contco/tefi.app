import { fromEntries, getPairPool } from "../utils";
import { contracts } from "../contracts";
import BigNumber from "bignumber.js";

export const getSpecPairStats = async (pool, pairInfos, govVaults) => { 
    const poolInfos: any = fromEntries(Object.entries(pool));
    const totalWeight: any = Object.values(poolInfos).reduce((a:any, b:any) => a + b.weight, 0);
    const govWeight = govVaults.vaults.find(item => item.address === contracts.specFarm)?.weight || 0;
   
    const pairStats = {};
   
    const tasks = Object.keys(poolInfos).map(async (key) => {
        const pairInfo = pairInfos[key];
        const poolInfo = poolInfos[key];
        const pairPool = await getPairPool(pairInfo.contract_addr); 
        const uusd = pairPool.assets.find(a => a.info.native_token?.['denom'] === 'uusd');
        if (!uusd) {
            return;
        }
        const value = new BigNumber(uusd.amount)
        .times(poolInfo?.total_bond_amount as string)
        .times(2)
        .div(pairPool.total_share)
        .toString();
        pairStats[key] = {
            poolApr: 0,
            poolApy: 0,
            farmApr: 0,
            tvl: value,
            multiplier: govWeight * poolInfo.weight / totalWeight,
            vaultFee: 0,
        };
   });
   await Promise.all(tasks);
   return pairStats;
}