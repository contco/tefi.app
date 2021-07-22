import { contracts } from "./contracts";
import BigNumber from "bignumber.js";
import { UNIT } from "../../mirror/utils";
import { getLpValue } from "../../utils";

export const getPoolValues = (lpBalance: number, lpValue: number, price: number) => {
    const stakedLpUstValue  = lpBalance * lpValue;
    const ustStaked = stakedLpUstValue / 2 ;
    const tokenStaked = ustStaked / price;
    return {stakedLpUstValue: stakedLpUstValue.toString(), ustStaked: ustStaked.toString(), tokenStaked: tokenStaked.toString()};
  }
  
  export const getStakedTokenValue = (value, poolResponse) => {
    if (poolResponse.assets[0].info.native_token) {
      return new BigNumber(value)
        .times(poolResponse.assets[0].amount)
        .div(poolResponse.assets[1].amount)
        .toString();
    } else {
      return new BigNumber(value)
      .times(poolResponse.assets[1].amount)
      .div(poolResponse.assets[0].amount)
      .toString();
    }
  }

export const calculateFarmInfos = (poolInfo, pairStats, pairRewardInfos, coinInfos, poolResponses, specPrice) => {
  const farmInfos = [];
  const tokenPrice = parseFloat(specPrice);
  for (const key of Object.keys(poolInfo)) { 
    
    if(pairRewardInfos[key] && pairRewardInfos[key].bond_amount) {
      const pairStat = pairStats.pairs[key];
      const poolApr = pairStat?.poolApr || 0;
      const poolApy = pairStat?.poolApy || 0;
      const specApr = pairStat?.specApr || 0;
      const govApr = pairStats.govApr || 0;
      const specApy = specApr + specApr * govApr / 2;
      const compoundApy = poolApy + specApy;
      const farmApr = pairStat?.farmApr || 0;
      const farmApy = poolApr + poolApr * farmApr / 2;
      const stakeApy = farmApy + specApy;
      const apy = Math.max(compoundApy, stakeApy).toString();
      const lpValue = getLpValue(poolResponses[key], tokenPrice);
      const stakedLp = parseFloat(pairRewardInfos[key].bond_amount)/UNIT;
      const stakedSpec = parseFloat(pairRewardInfos[key]?.pending_spec_reward)/UNIT;
      const stakedSpecValue = getStakedTokenValue(stakedSpec, poolResponses[contracts.specToken])
      let stakedMir = 0;
      let stakedMirValue = '0';

      if (poolInfo[key].farm === "Mirror") {
        stakedMir = parseFloat(pairRewardInfos[key]?.pending_farm_reward)/UNIT;
        stakedMirValue = getStakedTokenValue(stakedMir, poolResponses[contracts.mirrorToken]);
      }
      const poolValues = getPoolValues(stakedLp, lpValue, tokenPrice );
      const farmInfo = {
        symbol: coinInfos[key],
        lpName: `${coinInfos[key]}-UST LP`,
        stakedLp: stakedLp.toString(),
        stakedLpUstValue: poolValues.stakedLpUstValue,
        tokenStaked: poolValues.tokenStaked,
        ustStaked: poolValues.ustStaked,
        farm: poolInfo[key].farm,
        stakedSpec: stakedSpec.toString(),
        stakedSpecValue,
        stakedMir: stakedMir.toString(),
        stakedMirValue,
        apy,
      };
      farmInfos.push(farmInfo);
  }
}
return farmInfos;
}