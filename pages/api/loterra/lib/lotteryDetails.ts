import { contracts } from "./contracts";
import { wasmStoreRequest, math, MICRO } from "@contco/terra-utilities";

export const getLotteryDetails = async (address:string, lottery_id: string | undefined) => {
  if(lottery_id){
  try {
    const count_ticket = {
        count_ticket: {
            lottery_id
        },
   };
   const combinationParams = {
    combination: {
        lottery_id,
        address
    }
   };
   const jackpotParams = {
       jackpot: {
           lottery_id: parseInt(lottery_id) - 1 ,
       }
   };
    const ticketCountsRequest =  wasmStoreRequest(contracts.lotteryContract, count_ticket);
    const userCombinationsRequest =  wasmStoreRequest(contracts.lotteryContract, combinationParams);
    const jackPotRequest = wasmStoreRequest(contracts.lotteryContract, jackpotParams);
    const [ticketCounts, userCombinations, jackpot] = await Promise.all([ticketCountsRequest, userCombinationsRequest, jackPotRequest]);
    const recentJacpot = math.div(jackpot, MICRO);
    return {ticketCounts, userCombinations: userCombinations?.combination, jackpot: recentJacpot};
    }
    catch(err) {
        return {ticketCounts: null, userCombinations: null, jackpot: null};
    }   
}
return {ticketCounts: null, userCombinations: null, jackpot: null};
}