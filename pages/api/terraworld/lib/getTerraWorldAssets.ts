import { getPoolInfo, wasmStoreRequest } from '@contco/terra-utilities';
import { contracts } from './contracts';
import { getLpStakingInfo } from './getLpStaking';
import { getGovInfo } from './getGovInfo';
import { getLatestBlockHeight } from '@contco/terra-utilities';
import { getWalletHoldings } from './getWalletHoldings';

export const getTerrWorldASsets = async (address: string) => {
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
    const twdHoldingsRequest = wasmStoreRequest(contracts.token, balanceMsg);

    const [
      poolInfo,
      stakingLpInfo,
      stakingGovInfo,
      poolLpBalance,
      twdHoldingsInfo
    ] = await Promise.all([
      poolInfoRequest,
      stakingLpRequest,
      stakingGovRequest,
      poolLpRequest,
      twdHoldingsRequest
    ]);
    const twdPool = getLpStakingInfo(poolInfo, stakingLpInfo, poolLpBalance);
    const twdGov = getGovInfo( poolInfo, stakingGovInfo);
    const twdHoldings = getWalletHoldings(poolInfo, twdHoldingsInfo);
    return {twdHoldings, twdPool, twdGov };
  } catch (err) {
    return null;
  }
};
