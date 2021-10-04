import { getPoolInfo, wasmStoreRequest } from '@contco/terra-utilities';
import { contracts } from './contracts';
import { getLpStakingInfo } from './getLpStaking';
import { getGovInfo } from './getGovInfo';

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

    const holderLPMsg = {
      holder: {
        address: address,
      },
    };
    const accrued_rewards = {
      accrued_rewards: {
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
    const holderLP = wasmStoreRequest(contracts.loterraStakingLPAddress, holderLPMsg);
    const LPHolderAccruedRewards = wasmStoreRequest(contracts.loterraStakingLPAddress, accrued_rewards);
    const state_lp_staking = wasmStoreRequest(contracts.loterraStakingLPAddress, state_lp_stakingMsg);

    const [
      poolInfo,
      holderInfo,
      claimInfo,
      lpTokenInfo,
      holderLPInfo,
      lpRewardsInfo,
      stateLpStakingInfo,
    ] = await Promise.all([
      poolInfoRequest,
      holderRequest,
      claimsRequest,
      lpTokenRequest,
      holderLP,
      LPHolderAccruedRewards,
      state_lp_staking,
    ]);
    const lotaPool = getLpStakingInfo(poolInfo, lpTokenInfo, holderLPInfo, lpRewardsInfo, stateLpStakingInfo);
    const lotaGov = getGovInfo(holderInfo, poolInfo, claimInfo);
    return { lotaGov, lotaPool };
  } catch (err) {
    return null;
  }
};
