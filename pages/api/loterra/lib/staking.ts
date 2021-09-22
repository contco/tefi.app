import { getPoolInfo, getPrice, wasmStoreRequest } from '../../commons';
import { contracts } from './contracts';
import { getLpStakingInfo } from './getLpStaking';
import {getGovInfo} from './getGovInfo';

export const getLoterraStaking = async (address: string) => {
  try {
    const holderMsg = {
      holder: { address: address },
    };
    const claimMsg = {
      claims: {
        address: address,
      },
    };
    const LpTokenMsg = {
      balance: {
        address: address,
      },
    };

    const accrued_rewards = {
      accrued_rewards: {
        address: address,
      },
    };

    const holderLPMsg = {
      holder: {
        address: address,
      },
    };

    const claimsLpMsg = {
      claims: {
        address: address,
      },
    };

    const state_lp_stakingMsg = {
      state: {},
    };


    const poolInfoRequest = getPoolInfo(contracts.pool);
    const holderRequest = wasmStoreRequest(contracts.staking, holderMsg);
    const claimsRequest = wasmStoreRequest(contracts.staking, claimMsg);
    const lpTokenRequest = wasmStoreRequest(contracts.loterraLPAddress, LpTokenMsg);
    const LPHolderAccruedRewards = wasmStoreRequest(contracts.loterraStakingLPAddress, accrued_rewards);
    const holderLP = wasmStoreRequest(contracts.loterraStakingLPAddress, holderLPMsg);
    const claimsLp = wasmStoreRequest(contracts.loterraStakingLPAddress, claimsLpMsg);
    const state_lp_staking = wasmStoreRequest(contracts.loterraStakingLPAddress, state_lp_stakingMsg);

    const [
      poolInfo,
      holderInfo,
      claimInfo,
      lpTokenInfo,
      LPHolderAccruedRewardsInfo,
      holderLPInfo,
      claimsLpInfo,
      state_lp_stakingInfo,
    ] = await Promise.all([
      poolInfoRequest,
      holderRequest,
      claimsRequest,
      lpTokenRequest,
      LPHolderAccruedRewards,
      holderLP,
      claimsLp,
      state_lp_staking,
    ]);

    if (holderInfo?.balance && holderInfo?.balance !== '0') {
      const lpStaking = getLpStakingInfo(poolInfo, lpTokenInfo, holderLPInfo);
      const GovStaking = getGovInfo(holderInfo, poolInfo, claimInfo);
      return { GovStaking, lpStaking };
    }
    return null;
  } catch (err) {
    return null;
  }
};
