import {wasmStoreRequest} from "../commons/index";
import { contracts } from "./constants";

export const getLatestRound = async () => {
  try {
    const latest_stage_msg = {
      latest_stage: {}
  }
  const latestStage = await wasmStoreRequest(contracts.airdrop, latest_stage_msg);
  return latestStage?.latest_stage;
  }
  catch(err){
    return 0;
  }

}