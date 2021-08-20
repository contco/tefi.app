import { calculatePairStats } from "./calculatePairStats";
import { plus, times } from "../../../../../utils/math";
import { HEIGHT_PER_YEAR } from "../utils";


 export const getPairStats =  (height, pairStatsData, specPrice, mirrorPoolInfo, specPoolInfo, govConfig, govVaults, govState, pylonPoolInfo, anchorPoolInfo, terraSwapPoolResponses) => {  
    const pairStats: any = calculatePairStats(pairStatsData, mirrorPoolInfo, specPoolInfo, pylonPoolInfo, anchorPoolInfo, govConfig, govVaults, terraSwapPoolResponses);
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
    const govStaked  = govState?.total_staked;
    const govTvl =  times(govStaked, specPrice);
    const govApr = vaultFee / +govTvl;
    const stats = {pairs: pairStats, tvl, vaultFee, govStaked, govTvl, govApr};
    return stats;
}