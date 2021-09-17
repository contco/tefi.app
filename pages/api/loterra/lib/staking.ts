import { getPoolInfo, getPrice, wasmStoreRequest } from '../../commons';
import { div, times, plus } from '../../../../utils/math';
import { price, UNIT } from '../../mirror/utils';
import { contracts } from './contracts';
import { getLpValue } from '../../utils';

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

    const getPoolValues = (stakedlpBalance: number, stakeableLpBalance: number, lpValue: number, price: number) => {
      let token1UnStaked = null;

      const stakeableLpUstValue = stakeableLpBalance * lpValue;
      const stakedLpUstValue = stakedlpBalance * lpValue;
      const totalLpUstValue = stakeableLpUstValue + stakedLpUstValue;
      token1UnStaked = stakeableLpUstValue / 2;
      let token1Staked = stakedLpUstValue / 2;
      const token2UnStaked = token1UnStaked / price;
      const token2Staked = token1Staked / price;

      return {
        stakedLpUstValue: stakedLpUstValue.toString(),
        stakeableLpUstValue: stakeableLpUstValue.toString(),
        totalLpUstValue: totalLpUstValue.toString(),
        token1UnStaked: token1UnStaked.toString(),
        token1Staked: token1Staked.toString(),
        token2UnStaked: token2UnStaked.toString(),
        token2Staked: token2Staked.toString(),
      };
    };

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
    console.log('>>>> Pool Info', poolInfo);
    console.log('>>>> lpTokenInfo', lpTokenInfo);
    console.log('>>>> LPHolderAccruedRewardsInfo', LPHolderAccruedRewardsInfo);
    console.log('>>>> holderLPInfo', holderLPInfo);
    console.log('>>>>> state_lp_stakingInfo', state_lp_stakingInfo);
    console.log('>>>> claimsLpInfo', claimsLpInfo);

    const lpName = 'LOTA-UST';
    const symbol = 'LOTA';
    const symbo2 = 'UST';

    const lotaPrice = getPrice(poolInfo);
    let lpValue = getLpValue(poolInfo, parseFloat(lotaPrice));
    console.log('lpValue', lpValue);
    let stakableLpBlnce = parseFloat(lpTokenInfo.balance) / UNIT;
    let stakeLpBlnce = parseFloat(holderLPInfo.balance) / UNIT;

    let LpStakeInfo = getPoolValues(stakeLpBlnce, stakableLpBlnce, lpValue, parseFloat(lotaPrice));

    console.log('LpStakeInfo >>', LpStakeInfo);

    if (holderInfo?.balance && holderInfo?.balance !== '0') {
      const name = 'LOTA Gov';
      const symbol = 'LOTA';
      const staked = div(holderInfo?.balance, UNIT);
      const value = times(staked, lotaPrice);
      const lotaRewards = getLotaRewards(claimInfo?.claims);
      const lotaRewardsValue = times(lotaRewards, lotaPrice);
      const ustRewards = holderInfo?.pending_rewards !== '0' ? div(holderInfo?.pending_rewards, UNIT) : '0';
      const ustRewardsInLota = div(ustRewards, lotaPrice);
      const rewards = plus(lotaRewards, ustRewardsInLota);
      const rewardsValue = plus(lotaRewardsValue, ustRewards);
      const apr = '0';
      const GovStaking = { name, symbol, staked, value, rewards, rewardsValue, apr, price: lotaPrice };
      return GovStaking;
    }
    return null;
  } catch (err) {
    return null;
  }
};
