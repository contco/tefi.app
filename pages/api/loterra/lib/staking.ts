import { getPoolInfo, wasmStoreRequest } from '../../commons';
import { contracts } from './contracts';
import { getLpStakingInfo } from './getLpStaking';
import { getGovInfo } from './getGovInfo';
import {  UNIT } from '../../mirror/utils';
import {calculateAPY} from './calculateApy';

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

    const lotaPool = getLpStakingInfo(poolInfo, lpTokenInfo, holderLPInfo);
    const lotaGov = getGovInfo(holderInfo, poolInfo, claimInfo);
    const lpRewards = { lpRewards: lpRewardsInfo?.rewards / UNIT };
    const APY = calculateAPY(poolInfo, stateLpStakingInfo);
    // console.log("lotaPool >> ", stateLpStakingInfo.total_balance  )
    // console.log("lotaPool >> ", total_staked  )

    console.log(APY);

    return { lotaGov, lotaPool, lpRewards, APY };
  } catch (err) {
    return null;
  }
};
