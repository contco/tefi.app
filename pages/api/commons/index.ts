import axios from "axios";
import { LCD_URL,EXTRATERRESTRIAL_URl } from "../utils";
import { div } from "../../../utils/math";
import { fetchData } from "./fetchData";

export { wasmStoreRequest } from "./wasm";
export {fetchData} from "./fetchData";


export const getUserTokenBalance = async (address: string, token_addr: string) => {
  const { data } = await axios.get(LCD_URL + `wasm/contracts/${token_addr}/store`, {
    params: {
      query_msg: JSON.stringify({
        balance: {
          address
        }
      })
    },
  });
  return data?.result?.balance ?? 0;
};

export const getPoolInfo = async (pool_addr: string) => {
  const { data } = await axios.get(LCD_URL + `wasm/contracts/${pool_addr}/store`, {
    params: {
      query_msg: JSON.stringify({
        pool: {}
      })
    },
  });

  return data?.result;
};

export const getPrice = (poolResponse) => {
  if (poolResponse.assets[0].info.native_token && poolResponse.assets[1].info.native_token) {
    if (poolResponse.assets[0].info.native_token.denom === 'uusd' || poolResponse.assets[0].info.native_token.denom === 'uluna') {
      return div(poolResponse.assets[0].amount, poolResponse.assets[1].amount);
    }
    else {
      return div(poolResponse.assets[1].amount, poolResponse.assets[0].amount);
    }
  }
  else if (poolResponse.assets[0].info.native_token) {
    return div(poolResponse.assets[0].amount, poolResponse.assets[1].amount);
  } else {
    return div(poolResponse.assets[1].amount, poolResponse.assets[0].amount);
  }
}

export const getPriceBySymbol = async (symbol) => {
  if(symbol){
    const pricesRequest:any = await fetchData(EXTRATERRESTRIAL_URl)
    const tokenPrice = pricesRequest.data.prices[symbol].price;
    if(tokenPrice){
      return tokenPrice
    }
  }
  return 0;
}

export const isLunaPair = (poolResponse) => {
  if ((poolResponse?.assets[0]?.info?.native_token?.denom === 'uusd' || poolResponse?.assets[1]?.info?.native_token?.denom === 'uusd') || (poolResponse?.assets[0]?.info?.native_token?.denom === undefined && poolResponse?.assets[1]?.info?.native_token?.denom === undefined )) {
    return false;
  }
  else {
    return true;
  }
}

export const isNoneNativePair = (poolResponse) => {
  if (poolResponse?.assets[0]?.info?.native_token?.denom === undefined && poolResponse?.assets[1]?.info?.native_token?.denom === undefined ) {
    return true;
  }
  else {
    return false;
  }
}
