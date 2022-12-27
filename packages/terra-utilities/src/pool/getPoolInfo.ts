import axios from 'axios';
import { LCD_URL } from '../constants';

export const getPoolInfo = async (poolAddr: string, lcdUrl = LCD_URL) => {
    const { data } = await axios.get(lcdUrl + `wasm/contracts/${poolAddr}/store`, {
      params: {
        query_msg: JSON.stringify({
          pool: {}
        })
      },
    });
  
    return data?.result;
  };
  