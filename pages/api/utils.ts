export const FCD_URL = "https://fcd.terra.dev/v1/";
export const LCD_URL = "https://lcd.terra.dev/";
export const EXTRATERRESTRIAL_URl = 'https://api.extraterrestrial.money/v1/api/prices';
import { UUSD_DENOM, LUNA_DENOM } from "../api/terra-core/symbols";

export const getLatestBlockHeight = async () => {
  const response = await fetch('https://lcd.terra.dev/blocks/latest');
  const block = await response.json();
  return block.block.header.height;
};

export const getLpValue = (poolResponse: any, price: number, isLuna = false, lunaPrice?: number) => {
  const totalShares = parseFloat(poolResponse.total_share);
  let nativeReserve = 0;
  let tokenReserve = 0;

  if (poolResponse.assets[0].info.native_token && poolResponse.assets[1].info.native_token) {
    if (poolResponse.assets[0].info.native_token.denom === UUSD_DENOM || poolResponse.assets[0].info.native_token.denom === LUNA_DENOM) {
      nativeReserve = parseFloat(poolResponse.assets[0].amount);
      tokenReserve = parseFloat(poolResponse.assets[1].amount);
    }
    else {
      nativeReserve = parseFloat(poolResponse.assets[1].amount);
      tokenReserve = parseFloat(poolResponse.assets[0].amount);
    }
  }
  else {
    nativeReserve = parseFloat(poolResponse?.assets[0]?.info?.native_token ? poolResponse?.assets[0]?.amount : poolResponse?.assets[1]?.amount);
    tokenReserve = parseFloat(poolResponse?.assets[0]?.info?.native_token ? poolResponse?.assets[1]?.amount : poolResponse?.assets[0]?.amount);
  }
  let totalLpValue = (tokenReserve * price) + nativeReserve;
  if (isLuna) {
    totalLpValue = (tokenReserve * price) + nativeReserve * lunaPrice;
  }
  const lpValue = totalLpValue / totalShares;
  return lpValue;
};