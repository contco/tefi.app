import { div } from "../../../utils/math";
import { fetchData, wasmStoreRequest } from "../commons";
import { UNIT , times} from "../mirror/utils";
import { PYLON_API_ENDPOINT } from "./constants";

const getLoopPoolData = async (projects, address) =>{
  let gatewayPoolData = []
  const preSetPrice = "0.035";
  const timestamp = Math.floor(Date.now() / 1000);
  const query_blance = {balance_of:{owner:address}};
  const query_reward = {claimable_reward:{owner:address,timestamp}};
  let depositeSum = 0;
  let rewardsSum = 0;
  let task;
  try {
  projects.forEach( async (item,count) => {
    task = projects[count].pools.map(async p =>{
        const balanceRequest = await wasmStoreRequest(p.contract,query_blance);
        const balance = balanceRequest?.amount / UNIT;
        const rewardsRequest = await wasmStoreRequest(p.contract, query_reward);
        const rewards = div(rewardsRequest.amount, UNIT);
        const rewardsValue = times(rewards, preSetPrice);
        depositeSum = depositeSum + balance; 
        rewardsSum = rewardsSum + parseFloat(rewardsValue);
        const userProjectRequest:any =  await fetchData(PYLON_API_ENDPOINT + `gateway/v1/projects/${projects[count].symbol}/status/${address}`);
        const depositLogs = []
        userProjectRequest?.data.depositLogs?.map(a => depositLogs.push({deposit:(a?.amountInUst.toString() ?? "0"), depositDate:a.depositedAt, depositReleaseDate:"0", rewardReleaseDate:"0"}));
        if(balance !== 0){
          gatewayPoolData.push({symbol:projects[count].symbol, apy:"0", poolName:`${projects[count].symbol} `+p.name, depositLogs,totalDeposit:balance.toString(), rewards, rewardsValue}); 
        }
        return task;
      })  
    })
    await Promise.all(task);
    return {gatewayPoolData, gatewayDepositsSum: depositeSum.toString() , gatewayRewardsSum:rewardsSum.toString()};  
  } catch (error) {
    return {gatewayPoolData:[], gatewayDepositsSum:"0", gatewayRewardsSum:"0"};
  }
}

export const getGatewayData = async (address: string) => {
  try {
    const loopPoolContracts = await fetchData(PYLON_API_ENDPOINT + `gateway/v1/projects/`);
    const loopPoolRequest =  await getLoopPoolData(loopPoolContracts?.data?.projects, address);
    if(loopPoolRequest){
      return {...loopPoolRequest}
    }
    return { gatewayPoolData: [], gatewayDepositsSum: '0', gatewayRewardsSum: '0'};
  }
  catch(err){
    return { gatewayPoolData: [], gatewayDepositsSum: '0', gatewayRewardsSum: '0'};
  }
}