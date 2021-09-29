import axios from "axios";
import { wasmStoreRequest } from "@contco/terra-utilities";
import { LCD_URL } from "../utils";
import { contracts, PYLON_TOKEN_NAME, PYLON_TOKEN_SYMBOL } from "./constants";

export const getLatestRound = async () => {
  try {
    const latest_stage_msg = {
      latest_stage: {}
    }
    const latestStage = await wasmStoreRequest(contracts.airdrop, latest_stage_msg);
    return latestStage?.latest_stage;
  }
  catch (err) {
    return 0;
  }

}

const checkAirdropStatus = async (address: string, stage: number) => {
  const { data } = await axios.get(LCD_URL + `wasm/contracts/${contracts.airdrop}/store`, {
    params: {
      query_msg: JSON.stringify({
        is_claimed: {
          stage,
          address
        }
      })
    },
  });
  return !data?.result?.is_claimed;
};

export const getPylonAirdrops = async (address: string, price: number, data: any) => {
  const filteredAirrDrops = [];

  // re-check if claimed - maybe temp
  await Promise.all(data?.claimableAirdrops?.map(async (item) => {
    const isClaimed = await checkAirdropStatus(address, item?.stage);
    if (isClaimed) {
      filteredAirrDrops.push(item)
    }
  }));

  if (filteredAirrDrops.length) {
    let pylonAirdropSum = 0;
    const pylonAirdrops = filteredAirrDrops.map((airdrop) => {
      const { airdropMineAmount, merkleProof, stage } = airdrop;
      const value = (airdropMineAmount * price);
      pylonAirdropSum += value;
      const result = { name: PYLON_TOKEN_NAME, symbol: PYLON_TOKEN_SYMBOL, quantity: airdropMineAmount.toString(), value: value.toString(), round: stage, proof: merkleProof, contract: contracts.airdrop };
      return result;
    });
    return { pylonAirdropSum, pylonAirdrops };
  }
  return { pylonAirdropSum: '0', pylonAirdrops: [] };
}
