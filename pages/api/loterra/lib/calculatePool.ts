import { getPoolInfo, getPrice, wasmStoreRequest , isLunaPair } from '../../commons';
import { div, times, plus } from '../../../../utils/math';
import { calcPairPrice, UNIT } from '../../mirror/utils';
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
    console.log('>>>> Pool Info' , poolInfo)
    console.log('>>>> lpTokenInfo', lpTokenInfo);
    console.log('>>>> LPHolderAccruedRewardsInfo', LPHolderAccruedRewardsInfo);
    console.log('>>>> holderLPInfo', holderLPInfo);
    console.log('>>>>> state_lp_stakingInfo', state_lp_stakingInfo);
    console.log('>>>> claimsLpInfo', claimsLpInfo);

    if (holderInfo?.balance && holderInfo?.balance !== '0') {
      const lpName = 'LOTA Ust';
      const symbol = 'LOTA';
      const symbo2 = 'Ust';
      const price = getPrice(poolInfo);

    
        if (poolInfo.total_share && state_lp_stakingInfo.total_balance){
            const ratio = poolInfo.total_share / poolInfo.assets[0].amount
            var inLota = state_lp_stakingInfo.total_balance / ratio
            //console.log("state.poolInfo")
            //console.log(inLota / 1000000)
           // return inLota / 1000000
            inLota = inLota / 1000000
            console.log(inLota)
        }
    

      const staked = div(holderInfo?.balance, UNIT);
      const value = times(staked, price);
      const lotaRewards = getLotaRewards(claimInfo?.claims);
      const lotaRewardsValue = times(lotaRewards, price);
      const ustRewards = holderInfo?.pending_rewards !== '0' ? div(holderInfo?.pending_rewards, UNIT) : '0';
      const ustRewardsInLota = div(ustRewards, price);
      const rewards = plus(lotaRewards, ustRewardsInLota);
      const rewardsValue = plus(lotaRewardsValue, ustRewards);
      const apr = '0';
      //const result = { name, symbol, staked, value, rewards, rewardsValue, apr, price: lotaPrice };
      //return result;
    }
    return null;
  } catch (err) {
    return null;
  }
};




