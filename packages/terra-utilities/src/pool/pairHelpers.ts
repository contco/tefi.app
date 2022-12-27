export const isLunaPair = (poolResponse: any) => {
  if ((poolResponse?.assets[0]?.info?.native_token?.denom === 'uusd' || poolResponse?.assets[1]?.info?.native_token?.denom === 'uusd') || (poolResponse?.assets[0]?.info?.native_token?.denom === undefined && poolResponse?.assets[1]?.info?.native_token?.denom === undefined )) {
    return false;
  }
  else {
    return true;
  }
};
  
export const isNoneNativePair = (poolResponse: any) => {
  if (poolResponse?.assets[0]?.info?.native_token?.denom === undefined && poolResponse?.assets[1]?.info?.native_token?.denom === undefined ) {
    return true;
  }
  else {
    return false;
  }
};
  