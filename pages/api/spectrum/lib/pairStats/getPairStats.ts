import {getAnchorPairStatsData} from './anchorPairStats';
import { getMirrorPairStatsData } from './mirrorPairStats';
import { getPylonPairStatsData } from './pylonPairStats';

export const getPairStatsData = async (height) => {
  const anchorDataPromise = getAnchorPairStatsData(height);
  const mirrorDataPromise = getMirrorPairStatsData();
  const pylonDataPromise = getPylonPairStatsData(height);

  const [anchorPairStatsData, mirrorPairStatsData, pylonPairStatsData] = await Promise.all([anchorDataPromise, mirrorDataPromise, pylonDataPromise]);
  const result = {anchorPairStatsData, mirrorPairStatsData, pylonPairStatsData};
  return result;
}