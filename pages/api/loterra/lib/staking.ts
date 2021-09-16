import { getPoolInfo, getPrice, wasmStoreRequest } from '../../commons';
import { div, times, plus } from '../../../../utils/math';
import { UNIT } from '../../mirror/utils';
import { contracts } from './contracts';

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
      state: {}
    }


    console.log(address )

    const poolInfoRequest = getPoolInfo(contracts.pool);
    const holderRequest = wasmStoreRequest(contracts.staking, holderMsg);
    const claimsRequest = wasmStoreRequest(contracts.staking, claimMsg);
    const lpTokenRequest = wasmStoreRequest(contracts.loterraLPAddress, LpTokenMsg);
    const LPHolderAccruedRewards = wasmStoreRequest(contracts.loterraStakingLPAddress, accrued_rewards);
    const holderLP = wasmStoreRequest(contracts.loterraStakingLPAddress, holderLPMsg);
    const claimsLp = wasmStoreRequest(contracts.loterraStakingLPAddress, claimsLpMsg);
    const state_lp_staking = wasmStoreRequest(contracts.loterraStakingLPAddress, state_lp_stakingMsg);










    
    const [poolInfo, holderInfo, claimInfo , lpTokenInfo , LPHolderAccruedRewardsInfo , holderLPInfo , claimsLpInfo , state_lp_stakingInfo] = await Promise.all([
      poolInfoRequest,
      holderRequest,
      claimsRequest,
      lpTokenRequest,
      LPHolderAccruedRewards , holderLP , claimsLp , state_lp_staking
    ]);


    console.log('>>>> lpTokenInfo', lpTokenInfo);
    console.log('>>>> LPHolderAccruedRewardsInfo', LPHolderAccruedRewardsInfo);
    console.log('>>>> holderLPInfo', holderLPInfo);
    console.log('>>>>> state_lp_stakingInfo' ,state_lp_stakingInfo)
    console.log('>>>> claimsLpInfo', claimsLpInfo);



    if (holderInfo?.balance && holderInfo?.balance !== '0') {
      const name = 'LOTA Gov';
      const symbol = 'LOTA';
      const lotaPrice = getPrice(poolInfo);
      const staked = div(holderInfo?.balance, UNIT);
      const value = times(staked, lotaPrice);
      const lotaRewards = getLotaRewards(claimInfo?.claims);
      const lotaRewardsValue = times(lotaRewards, lotaPrice);
      const ustRewards = holderInfo?.pending_rewards !== '0' ? div(holderInfo?.pending_rewards, UNIT) : '0';
      const ustRewardsInLota = div(ustRewards, lotaPrice);
      const rewards = plus(lotaRewards, ustRewardsInLota);
      const rewardsValue = plus(lotaRewardsValue, ustRewards);
      const apr = '0';
      const result = { name, symbol, staked, value, rewards, rewardsValue, apr, price: lotaPrice };
      return result;
    }
    return null;
  } catch (err) {
    return null;
  }
};
