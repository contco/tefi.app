import { div, plus } from "../../../utils/math";
import { fetchData, wasmStoreRequest } from "../commons";
import { UNIT , times} from "../mirror/utils";
import { PYLON_API_ENDPOINT } from "./constants";

const getUserProjectsData = async (projects: any, address: string) => {
 if(projects) {
    const userProjectsDataPromise = projects.map( async (project: any) => {
      const userProjectPromise =  fetchData(PYLON_API_ENDPOINT + `launchpad/v1/projects/${project.symbol}/status/${address}`);
      const projectTokenOverviewPromise =  fetchData(PYLON_API_ENDPOINT + `${project.symbol}/v1/overview`);
      const [userProjectData, projectTokenOverview] = await Promise.all([userProjectPromise, projectTokenOverviewPromise]);
      const {priceInUst} = projectTokenOverview.data;
      return {project: userProjectData?.data, price: priceInUst};
     });

    const userProjects = await Promise.all(userProjectsDataPromise);
    return userProjects;
 }
    return null;
};

const updatePoolList = (data: any,  poolList) => {
    const depositIndex = poolList.findIndex(item => item.poolName === data.poolName);
    if (depositIndex === -1) {
        poolList.push({...data, totalDeposit: data.depositLogs[0].deposit});
        return {poolList, isNewPool: true};
    } 
    else {
        const depositLogs =  [...data.depositLogs, ...poolList[depositIndex].depositLogs];
        const totalDeposit = (parseFloat(poolList[depositIndex].totalDeposit) + parseFloat(data.depositLogs[0].deposit)).toString();
        const newData = {...data,  depositLogs, totalDeposit};
        poolList[depositIndex] = newData;
        return {poolList, isNewPool: false};
    }
}

const getLoopPoolData = async (project, address) =>{
  let poolsData = []
  const totalAmount = "1000000000000000";
  const preSetPrice = "0.035";
  const query_blance = {balance_of:{owner:address}};
  const query_reward = {claimable_reward:{owner:address,timestamp:Date.now()}};
  let depositeSum = 0;
  let rewardsSum = 0;
  try {
      const task = project.pools.map(async p =>{
        const balanceRequest = await wasmStoreRequest(p.contract,query_blance);
        const balance = balanceRequest?.amount / UNIT;
        const rewardsRequest = await wasmStoreRequest(p.contract, query_reward);
        const rewards = div(rewardsRequest.amount, totalAmount);
        const rewardsValue = times(rewards, preSetPrice);
        depositeSum += balance; 
        rewardsSum += parseFloat(rewardsValue);
        if(balance !== 0){
          poolsData.push({symbol:project.symbol, apy:"0", poolName:'LOOP '+p.name, depositLogs: [],totalDeposit:balance.toString(), rewards, rewardsValue}); 
        }
      return task;
    })
    await Promise.all(task)
    return {poolsData, depositeSum: depositeSum.toString() , rewardsSum:rewardsSum.toString()};
  } catch (error) {
    return {poolsData:[], depositeSum:"0", rewardsSum:"0"};
  }

}

const getProjectPoolData = (userProjects: any, launchpadProjects: any) => {
    let gatewayRewardsSum = 0;
    let gatewayDepositsSum = 0;
  const gatewayPoolData = userProjects.reduce((poolList, userData, index) => {
     if(userData && userData?.project?.depositLogs?.length !== 0) {
        let pool = [...poolList];
        userData?.project?.length && userData?.project?.depositLogs.forEach((deposit: any) => {
          const poolDetails = launchpadProjects[index]?.pools.find(pool => pool.id === deposit?.pool?.id); 
          const poolName = launchpadProjects[index]?.symbol+ " " +poolDetails?.name;
          const rewardReleaseDate = deposit?.pool?.cliffFinishesAt;
          const depositReleaseDate = deposit?.pool?.vestingFinishesAt;
          const rewardData = userData?.project?.accumulatedReward?.find(rewardData => rewardData?.id === deposit?.pool?.id);
          const rewards = (rewardData?.reward).toString() ?? "0";
          const rewardsValue = (rewardData?.reward * userData?.price) ?? 0;

          const data = {symbol:launchpadProjects[index]?.symbol, apy: poolDetails?.apy.toString(), poolName, depositLogs: [{deposit: (deposit?.amountInUst).toString(), depositDate: deposit?.depositedAt, rewardReleaseDate, depositReleaseDate}], rewards, rewardsValue: rewardsValue.toString()} 
          const {poolList: newPool, isNewPool} = updatePoolList(data, [...pool]);
          if (isNewPool) {
            gatewayDepositsSum = gatewayDepositsSum + deposit?.amountInUst;
            gatewayRewardsSum = gatewayRewardsSum + rewardsValue;
          }
          pool = [...newPool]
        });
        return pool;
     }
    return poolList;
  }, []);
  return {gatewayPoolData, gatewayDepositsSum: gatewayDepositsSum.toString(), gatewayRewardsSum: gatewayRewardsSum.toString()};
}

export const getGatewayData = async (address: string) => {
  try {
    const launchpadProjects = await fetchData(PYLON_API_ENDPOINT + `launchpad/v1/projects/`);
    const loopPoolContracts = await fetchData(PYLON_API_ENDPOINT + `gateway/v1/projects/loop/`);
    const loopPoolRequest =  await getLoopPoolData(loopPoolContracts?.data?.project, address);
    const userProjectsData = await getUserProjectsData(launchpadProjects?.data?.projects, address);
    if(userProjectsData) {
      const projectPoolData = getProjectPoolData(userProjectsData, launchpadProjects?.data?.projects);
      const gatewayPoolData = [...projectPoolData?.gatewayPoolData ,...loopPoolRequest?.poolsData];
      const gatewayDepositsSum = plus(projectPoolData.gatewayDepositsSum,loopPoolRequest.depositeSum);
      const gatewayRewardsSum = plus(projectPoolData.gatewayRewardsSum,loopPoolRequest.rewardsSum);
      return { gatewayPoolData, gatewayDepositsSum , gatewayRewardsSum};
    }
    return { gatewayPoolData: [], gatewayDepositsSum: '0', gatewayRewardsSum: '0'};
  }
  catch(err){
    return { gatewayPoolData: [], gatewayDepositsSum: '0', gatewayRewardsSum: '0'};
  }
}