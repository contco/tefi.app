import { getPoolInfo, wasmStoreRequest } from '@contco/terra-utilities';
import { contracts } from './contracts';
import { getLpStakingInfo } from './getLpStaking';
import { getGovInfo } from './getGovInfo';
import { getLatestBlockHeight } from '@contco/terra-utilities';

export const getTerraWorldStaking = async (address: string) => {
  try {
    const blockRequest = await getLatestBlockHeight();
    const blockHeight = parseFloat(blockRequest);
    const holderMsg = {
      holder: { address: address },
    };
    const claimMsg = {
      claims: {
        address: address,
      },
    };
    const balanceMsg = {
      balance: {
        address: address,
      },
    };

    const holderLPMsg = {
      holder: {
        address: address,
      },
    };

    const stakerInfo = {
      staker_info:{
        staker:address,
        block_height: blockHeight,
      }
    }

    const poolInfoRequest = getPoolInfo(contracts.pool);
    const stakingLpRequest =  wasmStoreRequest(contracts.twdPoolStakingContract, stakerInfo);
    const poolLpRequest = wasmStoreRequest(contracts.staking, balanceMsg);
    const stakingGovRequest =  wasmStoreRequest(contracts.twdGovStakingContract, stakerInfo);

    const [
      poolInfo,
      stakingLpInfo,
      stakingGovInfo,
      poolLpBalance,
    ] = await Promise.all([
      poolInfoRequest,
      stakingLpRequest,
      stakingGovRequest,
      poolLpRequest,
    ]);
    // console.log(poolInfo)
     console.log(stakingLpInfo);
    // console.log(stakingGovInfo);
    // console.log(poolLpBalance);

    const twdPoolStaking = getLpStakingInfo(poolInfo, stakingLpInfo, poolLpBalance);
    console.log('twdPool', twdPoolStaking);
    //const twdGov = getGovInfo(holderInfo, poolInfo, claimInfo);
    //return { twdGov, twdPool };
  } catch (err) {
    return null;
  }
};
