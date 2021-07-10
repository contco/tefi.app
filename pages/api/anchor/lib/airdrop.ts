import axios from "axios";
import networks from "../../../../utils/networks";
import {times, plus} from "../../mirror/utils";
import { demicrofy,formatANCWithPostfixUnits} from '@anchor-protocol/notation';



const ANCHOR_API_URL = "https://airdrop.anchorprotocol.com/api/get?";
const ANCHOR_TOKEN_NAME = "Anchor";
const ANCHOR_TOKEN_SYMBOL = "ANC";

const generateFetchUrl = (address: string, chainID) => {
    const uri = `${ANCHOR_API_URL}address=${address}&chainId=${chainID}`;
    return uri; 
}

export const getAirdrops = async (address: string) => {
    const anchorURI = generateFetchUrl(address, networks.mainnet.chainID);
    const result = await axios.get(anchorURI);
    return result;
}


export const formatAirdrops = (result: any , ancPrice: string) => {
  if (result?.data) {
  
    const claimableAirdrops = result?.data.filter(airdrop => airdrop.claimable);
    if(claimableAirdrops && claimableAirdrops.length > 0) {
      let airdropSum = '0';
      const airdrops = result?.data.map((airdrop: any) => {
        const amount = formatANCWithPostfixUnits(demicrofy(airdrop?.amount));
        const price = times(ancPrice, amount);
        airdropSum = plus(airdropSum, price);
        return {quantity: amount, name: ANCHOR_TOKEN_NAME, round: airdrop?.stage, price, symbol: ANCHOR_TOKEN_SYMBOL };
      });
      return {airdrops, airdropSum};
    }
  }
  
  return {airdrops: [], airdropSum: '0'};

}