import {fetchUserGovStaking, getStarTerraGov} from './gov';
import {fetchUserStarTerraStakingPools, fetchUserLpData, getStarTerraPools} from './pools';
import { getPoolInfo, getPrice} from '../../commons';

import {contracts} from './contracts';

const fetchData = async (address: string) => {
   const userGovStaking = fetchUserGovStaking(address);
   const userLpStaking = fetchUserStarTerraStakingPools(address);
   const poolInfo = getPoolInfo(contracts.pool);
   const userLpInfo = fetchUserLpData(address);
   const result = Promise.all([userGovStaking, userLpStaking, poolInfo, userLpInfo]);
   return result;
}

export const getStarTerraAccount = async (address: string) => {
    try {
     const [userGovData, userLpStaking, poolInfo, userLpInfo] = await fetchData(address);
     const sttPrice = getPrice(poolInfo);
     const starTerraGov = getStarTerraGov(userGovData, sttPrice);
     const starTerraPools = getStarTerraPools(userLpStaking, userLpInfo, poolInfo, sttPrice);
     return {starTerraPools, starTerraGov};
    }
    catch(err) {
        console.log(err);
    }

}