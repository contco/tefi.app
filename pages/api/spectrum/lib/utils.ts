import axios from "axios";
import { LCD_URL } from "../../utils";
export function fromEntries<T>(entries: [string, T][]) {
    return entries.reduce((a, [k, v]) => (a[k] = v, a), {} as Record<string, T>);
}

export const getPairPool = async(contract: string) => {
    const {data: pairPool} =  await axios.get(LCD_URL + `wasm/contracts/${contract}/store`, {
        params: {
          query_msg: JSON.stringify({
            pool: {}
          })
       },
    });
   return pairPool?.result;
}