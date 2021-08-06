import axios from "axios";
import { PYLON_API_ENDPOINT } from "./constants";


const getUserProjectsData = async (projects: any, address: string) => {
 if(projects) {
    const userProjectsDataPromise = projects.map( async (project: any) => {
      const userProjectPromise =  axios.get(PYLON_API_ENDPOINT + `launchpad/v1/projects/${project.symbol}/status/${address}`);
      const projectTokenOverviewPromise =  axios.get(PYLON_API_ENDPOINT + `${project.symbol}/v1/overview`);
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

const getProjectPoolData = (userProjects: any, launchpadProjects: any) => {
    let gatewayRewardsSum = 0;
    let gatewayDepositsSum = 0;
  const gatewayPoolData = userProjects.reduce((poolList, userData, index) => {
     if(userData && userData?.project?.depositLogs?.length !== 0) {
        let pool = [...poolList];
       userData?.project?.depositLogs.forEach((deposit: any) => {
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
    const launchpadProjects = await axios.get(PYLON_API_ENDPOINT + `launchpad/v1/projects/`);
    const userProjectsData = await getUserProjectsData(launchpadProjects?.data?.projects, address);
    if(userProjectsData) {
    const projectPoolData = getProjectPoolData(userProjectsData, launchpadProjects?.data?.projects);
    return projectPoolData;
    }
    return { gatewayPoolData: [], gatewayDepositsSum: '0', gatewayRewardsSum: '0'};
  }
  catch(err){
    return { gatewayPoolData: [], gatewayDepositsSum: '0', gatewayRewardsSum: '0'};
  }
}