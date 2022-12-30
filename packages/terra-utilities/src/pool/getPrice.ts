import {math} from '../math';

const { div } = math;

export const getPrice = (poolResponse: any) => {
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