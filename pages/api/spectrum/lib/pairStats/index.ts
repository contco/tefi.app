import { getMirrorPairStats } from "./mirrorPairStats";
import { getSpecPairStats } from "./specPairStats";
import { plus } from "../../../../../utils/math";
import { HEIGHT_PER_YEAR } from "../utils";


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