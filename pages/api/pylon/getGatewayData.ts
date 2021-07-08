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

const getProjectPoolData = (userProjects: any, launchpadProjects: any) => {
  const poolData = userProjects.reduce((poolList, userData, index) => {
     if(userData && userData?.project?.depositLogs?.length !== 0) {
       const data = userData?.project?.depositLogs.map((deposit: any) => {
          const poolDetails = launchpadProjects[index]?.pools.find(pool => pool.id === deposit?.pool?.id); 
          const poolName = launchpadProjects[index]?.symbol+ " " +poolDetails?.name;
          const rewardReleaseDate = deposit?.pool?.cliffFinishesAt;
          const depositReleaseDate = deposit?.pool?.vestingFinishesAt;
          const rewardData = userData?.project?.accumulatedReward?.find(rewardData => rewardData?.id === deposit?.pool?.id);
          const reward = (rewardData?.reward).toString() ?? "0";
          const rewardValue = (rewardData?.reward * userData?.price).toString() ?? "0";
          return {apy: poolDetails?.apy.toString(), poolName, deposit: (deposit?.amountInUst).toString(), depositDate: deposit?.depositedAt, rewardReleaseDate, depositReleaseDate, reward, rewardValue} ;
        });
        poolList.push(...data);
     }
    return poolList;
  }, []);
  return poolData;
}

export const getGatewayData = async (address: string) => {
    const launchpadProjects = await axios.get(PYLON_API_ENDPOINT + `launchpad/v1/projects/`);
    const userProjectsData = await getUserProjectsData(launchpadProjects?.data?.projects, address);
    if(userProjectsData) {
    const projectPoolData = getProjectPoolData(userProjectsData, launchpadProjects?.data?.projects);
    return projectPoolData;
    }
    return [];
}