import axios from 'axios';
import { LCD_URL } from '../../../utils';
import { contracts } from '../contracts';

const rewardInfoRequest = async (address, height, contract) => {
  const rewardInfos = await axios.get(
    LCD_URL +
      `wasm/contracts/${contract}/store?query_msg=%7B%22reward_info%22:%7B%22staker_addr%22:%22${address}%22,%22height%22:${height}%7D%7D`,
  );
  return rewardInfos?.data?.result?.reward_infos;
};

const formatRewardInfos = (rewards) => {
  const rewards_infos = {};
  rewards.forEach((item) => {
    rewards_infos[item?.asset_token] = item;
  });
  return rewards_infos;
};

const fetchRewardInfos = async (address, height) => {
  const mirrorRewardsInfoRequest = rewardInfoRequest(address, height, contracts.mirrorFarm);
  const specRewardInfosRequest = rewardInfoRequest(address, height, contracts.specFarm);
  const pylonRewardInfosRequest = rewardInfoRequest(address, height, contracts.pylonFarm);
  const anchorRewardInfosRequest = rewardInfoRequest(address, height, contracts.anchorFarm);
  const result = await Promise.all([
    mirrorRewardsInfoRequest,
    specRewardInfosRequest,
    pylonRewardInfosRequest,
    anchorRewardInfosRequest,
  ]);
  return result;
};

export const getRewardInfos = async (address, height) => {
  const [mirrorRewardInfos, specRewardInfos, pylonRewardInfos, anchorRewardInfos] = await fetchRewardInfos(
    address,
    height,
  );
  const rewardInfos = formatRewardInfos([
    ...mirrorRewardInfos,
    ...specRewardInfos,
    ...pylonRewardInfos,
    ...anchorRewardInfos,
  ]);
  return rewardInfos;
};
