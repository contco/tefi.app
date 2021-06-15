import axios from "axios";
import networks from "../../../../utils/networks";
import {times} from "../../mirror/utils";
import { demicrofy,formatANCWithPostfixUnits} from '@anchor-protocol/notation';



const ANCHOR_API_URL = "https://airdrop.anchorprotocol.com/api/get?";
const ANCHOR_TOKEN_NAME = "Anchor";

const generateFetchUrl = (address: string, chainID) => {
    const uri = `${ANCHOR_API_URL}address=${address}&chainId=${chainID}`;
    return uri; 
}

export const getAirdrops = async (address: string, ancPrice: string) => {
    const anchorURI = generateFetchUrl(address, networks.mainnet.chainID);
    let result = await axios.get(anchorURI);
    if (result?.data) {
    let airdrops = result?.data.map((airdrop: any) => {
      let amount = formatANCWithPostfixUnits(demicrofy(airdrop?.amount));
      let price = times(ancPrice, amount);
      return {quantity: amount, name: ANCHOR_TOKEN_NAME, round: airdrop?.stage, price };
    });
    return airdrops;
    }
    else return []; 
}