import axios from "axios";
import networks from "../../../../utils/networks";
import { plus} from "../../mirror/utils";
import { demicrofy,formatANCWithPostfixUnits} from '@anchor-protocol/notation';
import { LCD_URL } from "../../utils";


const ANCHOR_API_URL = "https://airdrop.anchorprotocol.com/api/get?";
const ANCHOR_TOKEN_NAME = "Anchor";
const ANCHOR_TOKEN_SYMBOL = "ANC";

const generateFetchUrl = (address: string, chainID) => {
    const uri = `${ANCHOR_API_URL}address=${address}&chainId=${chainID}`;
    return uri; 
}

export const isAirdropsClaimed = async (address: string, stage: string) => {
  try {
   const {data} =  await axios.get(LCD_URL + `wasm/contracts/terra146ahqn6d3qgdvmj8cj96hh03dzmeedhsf0kxqm/store`, {
       params: {
         query_msg: JSON.stringify({
           is_claimed: {
             address,
             stage: parseInt(stage)
           }
         })
      },
   });
   return data?.result?.is_claimed;
 }
 catch(err) {
   throw new Error("Error fetching airdrop claim info");
 }

}

export const getAirdrops = async (address: string) => {
  try {
    const anchorURI = generateFetchUrl(address, networks.mainnet.chainID);
    const result = await axios.get(anchorURI);
    if(result?.data && result?.data.length > 0 ) {
      const airdropsClaimsPromise = result?.data?.map(async (data) => {
         const isClaimed = await isAirdropsClaimed(address, data?.stage);
         return {...data, isClaimed};
      });
    const airdrops=  await Promise.all(airdropsClaimsPromise);
    return airdrops;
  }
  else return [];
  }
  catch(err) {
    return [];
  }

}


export const formatAirdrops = (result: any , ancPrice: string) => {
  if (result && result?.length > 0) {  
    const claimableAirdrops = result.filter(airdrop => !airdrop.isClaimed);
    if(claimableAirdrops && claimableAirdrops.length > 0) {
      let airdropSum = '0';
      const airdrops = claimableAirdrops.map((airdrop: any) => {
        const amount = formatANCWithPostfixUnits(demicrofy(airdrop?.amount));
        const price = (parseFloat(ancPrice) * parseFloat(amount)).toString();
        airdropSum = plus(airdropSum, price);
        return {quantity: amount, name: ANCHOR_TOKEN_NAME, round: airdrop?.stage, price, symbol: ANCHOR_TOKEN_SYMBOL };
      });
      return {airdrops, airdropSum};
    }
  }
  
  return {airdrops: [], airdropSum: '0'};

}