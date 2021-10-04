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
    const poolRewardRequest =  wasmStoreRequest(contracts.twdPoolStakingContract, stakerInfo);
    const govRewardsRequest =  wasmStoreRequest(contracts.twdGovStakingContract, stakerInfo);
    const poolLpRequest = wasmStoreRequest(contracts.staking, balanceMsg);


    const [
      poolInfo,
      poolRewardInfo,
      govRewardInfo,
      poolLpInfo,
    ] = await Promise.all([
      poolInfoRequest,
      poolRewardRequest,
      govRewardsRequest,
      poolLpRequest,
    ]);
    console.log(poolInfo)
    console.log(poolRewardInfo);
    console.log(govRewardInfo);
    console.log(poolLpInfo);

    //const twdPool = getLpStakingInfo(poolInfo, lpTokenInfo, holderLPInfo);
    //const twdGov = getGovInfo(holderInfo, poolInfo, claimInfo);
    //return { twdGov, twdPool };
  } catch (err) {
    return null;
  }
};
