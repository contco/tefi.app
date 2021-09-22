import { contracts } from "./contracts";
import { wasmStoreRequest } from "../../commons";
import { UNIT } from "../../mirror/utils";

const STT_SYMBOL = "STT";
const GOV_NAME = "STT Gov";

const getStakingMsg = (address: string) => {
   return ({
       staker_info: {
           staker: address,
       }
   })
}

export const fetchUserGovStaking = async (address: string) => {
  try {
    const query_msg = getStakingMsg(address);
    const stakingResultPromise =  contracts.govContracts.map( async (govContract: any) => {
      const stakingInfo = await wasmStoreRequest(govContract.contract, query_msg );
      return {factionName: govContract.faction, ...stakingInfo};
    }); 

    const stakingResults  = await Promise.all(stakingResultPromise);
    const filteredResults = stakingResults.filter(item => item.bond_amount !== '0');
 		return filteredResults;
 	}
 	catch(err) {
    return [];
 }
}


export const getStarTerraGov = (userGovData: any, sttPrice: string) => {
	if(userGovData.length === 0) {
		return null;
	}
	else  {
    const govData = userGovData.map((item) => {
      const staked = parseFloat(item.bond_amount) / UNIT;
			const value = staked * parseFloat(sttPrice);
      const rewards = parseFloat(item.pending_reward) / UNIT;
			const rewardsValue = rewards * parseFloat(sttPrice);
      return {symbol: STT_SYMBOL, faction: item.factionName, name: GOV_NAME, staked: staked.toString(), value: value.toString(), rewards: rewards.toString(), rewardsValue: rewardsValue.toString()};
		});
	  return govData;
	}
}