import axios from "axios";
import { LCD_URL } from "../../../utils";
import { contracts } from "../contracts";

export const getMirrorRewardInfos = async (address, height) => {
    const mirrorRewards =  await axios.get(LCD_URL + `wasm/contracts/${contracts.mirrorFarm}/store`, {
        params: {
          query_msg: JSON.stringify({
            reward_info: {
                staker_addr: address,
                height,
              }
          })
       },
    });
}

export const getSpecRewardInfos = async (address, height) => {
    const specRewards =  await axios.get(LCD_URL + `wasm/contracts/${contracts.specFarm}/store`, {
        params: {
          query_msg: JSON.stringify({ 
            reward_info: {
                staker_addr: address,
                height,
              }
          })
       },
    });
}

export const getRewardInfos = async (address, height) => {
  // const mirrorRewardInfos = await getMirrorRewardInfos(address,height);
  //const specRewardInfos = await getSpecRewardInfos(address, height);
};