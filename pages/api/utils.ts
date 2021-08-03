export const FCD_URL = "https://fcd.terra.dev/v1/";
export const LCD_URL = "https://lcd.terra.dev/";
import { LUNA_DENOM } from "../api/terra-core/symbols";

export const getLatestBlockHeight = async () => {
  const response = await fetch('https://lcd.terra.dev/blocks/latest');
  const block = await response.json();
  return block.block.header.height;
};


export const getLpValue = (liquidityInfo: any, price: number) => {
  const totalShares = parseFloat(liquidityInfo.total_share);
  let ustReserve = 0
  let tokenReserve = 0
  if (!(liquidityInfo.assets[0].info.native_token && liquidityInfo.assets[1].info.native_token)) {
    ustReserve = parseFloat(liquidityInfo?.assets[0]?.info?.native_token ? liquidityInfo?.assets[0]?.amount : liquidityInfo?.assets[1]?.amount);
    tokenReserve = parseFloat(liquidityInfo?.assets[0]?.info?.native_token ? liquidityInfo?.assets[1]?.amount : liquidityInfo?.assets[0]?.amount);
  }
  else {
    ustReserve = parseFloat(liquidityInfo?.assets[0]?.info?.native_token.denom === LUNA_DENOM ? liquidityInfo?.assets[0]?.amount : liquidityInfo?.assets[1]?.amount);
    tokenReserve = parseFloat(liquidityInfo?.assets[0]?.info?.native_token.denom === LUNA_DENOM ? liquidityInfo?.assets[1]?.amount : liquidityInfo?.assets[0]?.amount);
  }
  const totalLpValue = (tokenReserve * price) + ustReserve;
  const lpValue = totalLpValue / totalShares;
  return lpValue;
};