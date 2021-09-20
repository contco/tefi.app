import { getPoolInfo, getPrice, wasmStoreRequest } from '../../commons';
import { div, times, plus } from '../../../../utils/math';
import { UNIT } from '../../mirror/utils';
import { contracts } from './contracts';
import { getLpStakingInfo } from './getLpStaking';

const getLotaRewards = (claims: any) => {
  if (claims && claims.length > 0) {
    const totalClaims = claims.reduce((acm, item) => plus(acm + item), '0');
    const lotaBalance = div(totalClaims, UNIT);
    return lotaBalance;
  }
  return '0';
};

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

    console.log(address);

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

    const lpInfo = getLpStakingInfo(poolInfo, lpTokenInfo, holderLPInfo);
    console.log('object >>', lpInfo);

    if (holderInfo?.balance && holderInfo?.balance !== '0') {
      const name = 'LOTA Gov';
      const symbol = 'LOTA';
      const staked = div(holderInfo?.balance, UNIT);
      const price = getPrice(poolInfo);
      const value = times(staked, price);
      const lotaRewards = getLotaRewards(claimInfo?.claims);
      const lotaRewardsValue = times(lotaRewards, price);
      const ustRewards = holderInfo?.pending_rewards !== '0' ? div(holderInfo?.pending_rewards, UNIT) : '0';
      const ustRewardsInLota = div(ustRewards, price);
      const rewards = plus(lotaRewards, ustRewardsInLota);
      const rewardsValue = plus(lotaRewardsValue, ustRewards);
      const apr = '0';
      const GovStaking = { name, symbol, staked, value, rewards, rewardsValue, apr, price };
      return GovStaking;
    }
    return null;
  } catch (err) {
    return null;
  }
};
