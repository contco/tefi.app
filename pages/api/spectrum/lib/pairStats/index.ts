import { getMirrorPairStats } from "./mirrorPairStats";
import { getSpecPairStats } from "./specPairStats";
import { getPylonPairStats } from "./pylonPairStats";
import { plus, times } from "../../../../../utils/math";
import { HEIGHT_PER_YEAR } from "../utils";
import { getAnchorPairStats } from "./anchorPairStats";

const fetchPairStats = async (height, mirrorPoolInfo, specPoolInfo, pylonPoolInfo, anchorPoolInfo, pairInfo, govConfig, govVaults, terraSwapPoolResponses) => {
    const mirrorStatsPromise = getMirrorPairStats(mirrorPoolInfo, pairInfo, govConfig, govVaults);
    const specStatsPromise =  getSpecPairStats(specPoolInfo, pairInfo, govVaults);
    const pylonStatsPromise = getPylonPairStats(height, pylonPoolInfo, govVaults, govConfig, terraSwapPoolResponses);
    const anchorStatsPromise = getAnchorPairStats(height, anchorPoolInfo, govVaults, govConfig, terraSwapPoolResponses);
    const [mirrorStats, specStats, pylonStats, anchorStats] = await Promise.all([mirrorStatsPromise, specStatsPromise, pylonStatsPromise, anchorStatsPromise]);
    return {...mirrorStats, ...specStats, ...pylonStats, ...anchorStats};
}
 export const getPairStats = async (height, specPrice, mirrorPoolInfo, specPoolInfo, pairInfo, govConfig, govVaults, govState, pylonPoolInfo, anchorPoolInfo, terraSwapPoolResponses) => {
    
    const pairStats: any = await fetchPairStats(height, mirrorPoolInfo, specPoolInfo, pylonPoolInfo, anchorPoolInfo, pairInfo, govConfig, govVaults, terraSwapPoolResponses);
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