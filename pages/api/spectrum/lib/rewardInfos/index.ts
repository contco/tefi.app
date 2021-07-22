import axios from "axios";
import { LCD_URL } from "../../../utils";
import { contracts } from "../contracts";

export const getMirrorRewardInfos = async (address, height) => {
  const mirrorRewards =  await axios.get(LCD_URL + `wasm/contracts/${contracts.mirrorFarm}/store?query_msg=%7B%22reward_info%22:%7B%22staker_addr%22:%22${address}%22,%22height%22:${height}%7D%7D`);
  return mirrorRewards?.data?.result?.reward_infos;
}

export const getSpecRewardInfos = async (address, height) => {
    const specRewards =  await axios.get(LCD_URL + `wasm/contracts/${contracts.specFarm}/store?query_msg=%7B%22reward_info%22:%7B%22staker_addr%22:%22${address}%22,%22height%22:${height}%7D%7D`);
    return specRewards?.data?.result?.reward_infos;
}

const formatRewardInfos = (rewards) => {
  const rewards_infos = {};
  rewards.forEach((item) => {
   rewards_infos[item?.asset_token] = item;
  });
  return rewards_infos;
}


export const getRewardInfos = async (address, height) => {
  const mirrorRewardInfos = await getMirrorRewardInfos(address,height);
  const specRewardInfos = await getSpecRewardInfos(address, height);
  const rewardInfos = formatRewardInfos([...mirrorRewardInfos, ...specRewardInfos]);
  return rewardInfos;
};