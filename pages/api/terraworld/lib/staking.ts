import { getPoolInfo, wasmStoreRequest } from '@contco/terra-utilities';
import { contracts } from './contracts';
import { getLpStakingInfo } from './getLpStaking';
import { getGovInfo } from './getGovInfo';
import { getLatestBlockHeight } from '@contco/terra-utilities';

export const getTerraWorldStaking = async (address: string) => {
  try {
    const blockRequest = await getLatestBlockHeight();
    const blockHeight = parseFloat(blockRequest);
    
    const balanceMsg = {
      balance: {
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
    console.log(stakingGovInfo);
    const twdPool = getLpStakingInfo(poolInfo, stakingLpInfo, poolLpBalance);
    const twdGov = getGovInfo( poolInfo, stakingGovInfo);
    
    return { twdPool, twdGov };
  } catch (err) {
    return null;
  }
};
