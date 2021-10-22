import axios from 'axios';
import { LCD_URL } from '../../../utils';

export const getTokenData = async (token) => {
  const result = await axios.get(LCD_URL + `wasm/contracts/${token}/store`, {
    params: {
      query_msg: JSON.stringify({
        token_info: {},
      }),
    },
  });
  return result?.data?.result;
};

export const getCoinInfos = async (poolInfo: any) => {
  const coinInfos = {};
  const tasks = Object.keys(poolInfo).map(async (key: any) => {
    const coinInfo = await getTokenData(key);
    coinInfos[key] = coinInfo?.symbol;
    return coinInfo;
  });

  await Promise.all(tasks);
  return coinInfos;
};
