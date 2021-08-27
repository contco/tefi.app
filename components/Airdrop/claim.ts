import { times} from "../../utils/math";
import { UNIT } from "../../pages/api/mirror/utils";
import { MsgExecuteContract} from "@terra-money/terra.js";
import { getTxOptions } from "../../transactions/getTxOptions";

const BATCH_LIMIT = 15;


const generateTxOptions = (airdrops: Airdrops[], address: string) => {
    const airdropBatches = [];
    for(let i = 0; i < airdrops.length; i+= BATCH_LIMIT) {
         airdropBatches.push(airdrops.slice(i, i+BATCH_LIMIT));
    }
    const txOptionBatches = airdropBatches.map((airdropBatch: Airdrops[]) => {
        const claimMessages = airdropBatch.map((airdrop: Airdrops) => {
            const msg = new MsgExecuteContract(address, airdrop.contract, {
                claim: {
                    amount: times(airdrop.quantity, UNIT),
                    stage: airdrop.round,
                    proof: airdrop.proof,
                }
            }, [])
            return msg;
        });
        const txOptions = getTxOptions(claimMessages);
        return txOptions;
    });
    return txOptionBatches;
}

const executeAirdropClaim = async (txOptionBatches: any, post: any) => {
    try {
        const executedResults = [];
        for(let i = 0; i < txOptionBatches.length; i++) {
            const result = await post(txOptionBatches[i]);
            executedResults.push(result);
        }
        return executedResults;
    }
    catch(err){
        throw new Error('Error claiming all airdrops');
    }
};

export const claimAirdrops = async (airdrops: Airdrops[], address: string, post) => {
    try {
      const txOptionBatches = generateTxOptions(airdrops, address);
      await executeAirdropClaim(txOptionBatches, post);
      return true;
    }
    catch(err){
      return false;
    }
}