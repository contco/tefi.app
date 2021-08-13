import { assets } from "../../constants/assets";

export const getTokenKey = (pairData, keyName: string) => {
    if(pairData?.token0?.symbol === assets[keyName].terraSwapSymbol){
      return 'token0';
    }
    else {
      return 'token1';
    }
  }
  