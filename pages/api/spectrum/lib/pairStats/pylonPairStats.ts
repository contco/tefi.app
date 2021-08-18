import axios from "axios";
import { LCD_URL } from "../../../utils";
import { contracts } from "../contracts";
import { createPairStats } from "../utils";
import { fetchData } from "../../../commons";
import { PYLON_API_ENDPOINT } from "../../../pylon/constants";
import { getPoolInfo } from "../../../commons";
import BigNumber from 'bignumber.js';


const getFarmConfig = async () => {
    const {data: farmConfig} =  await axios.get(LCD_URL + `wasm/contracts/${contracts.pylonFarm}/store`, {
        params: {
          query_msg: JSON.stringify({
            config: {}
          })
       },
    });
   return farmConfig?.result;
}

const getRewardInfos = async (height: string) =>  {
    const {data: rewardInfos} =  await axios.get(LCD_URL + `wasm/contracts/${contracts.pylonStaking}/store`, {
        params: {
          query_msg: JSON.stringify({
            staker_info: {
                block_height: +height, 
                staker: contracts.pylonFarm,
            }
          })
       },
    });
    return rewardInfos?.result;
}


const getPylonApy = async () => {
  const [govData ,lpData] = await Promise.all([fetchData(PYLON_API_ENDPOINT+'governance/v1/overview'), fetchData(PYLON_API_ENDPOINT+'liquidity/v1/overview')]);
  const govApy =  govData?.data?.apy ? govData?.data?.apy.toString() : '0';
  const lpApy = lpData?.data?.apy;
  console.log(typeof(govApy));
  const govStats = {statistic: {govAPR: govApy}};
  return {govStats, lpApy};
}

export const getPylonPairStats = async (height, poolInfos, pairInfos, govVaults, govConfig ) => {
    const rewardInfo = await getRewardInfos(height);
    const farmConfig = await getFarmConfig();
    const pylonTerraSwapPair = pairInfos[contracts.pylonToken];
    const terraSwapPool = await getPoolInfo(pylonTerraSwapPair.contract_addr)
    const {govStats, lpApy} = await getPylonApy();
    const poolApr = +(lpApy || 0);

    const totalWeight = Object.values(poolInfos).reduce((a, b: any) => a + b.weight, 0);
    const govWeight = govVaults.vaults.find(vault => vault.address === contracts.pylonFarm)?.weight || 0;
    const pairs = {};
    pairs[contracts.pylonToken] = createPairStats(poolApr, contracts.pylonToken, poolInfos, govWeight, totalWeight, govStats );


    const communityFeeRate = +farmConfig.community_fee * (1 - +govConfig.warchest_ratio);
    const uusd = terraSwapPool?.assets.find(a => a.info.native_token?.['denom'] === 'uusd');
    if (!uusd) {
      return;
    }
    const pair = pairs[contracts.pylonToken];
    const value = new BigNumber(uusd.amount)
      .times(rewardInfo.bond_amount)
      .times(2)
      .div(terraSwapPool.total_share)
      .toString();
    pair.tvl = value;
    pair.vaultFee = +pair.tvl * pair.poolApr * communityFeeRate;
    pairs[contracts.pylonToken] = pair;
    
    return pairs;
};