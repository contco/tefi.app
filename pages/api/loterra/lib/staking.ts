import { getPoolInfo, getPrice, wasmStoreRequest  } from "../../commons";
import { div, times, plus} from "../../../../utils/math";
import { UNIT } from "../../mirror/utils";
import { contracts } from "./contracts";

const getLotaRewards = (claims: any) => {
    if(claims && claims.length > 0) {
        const totalClaims = claims.reduce((acm, item ) => plus(acm + item), '0');
        const lotaBalance = div(totalClaims, UNIT);
        return lotaBalance;
    }
    return '0';
}

export const getLoterraStaking = async (address: string) => {
    try{
    const holderMsg = {
        holder: {address: address}
    };
    const claimMsg = {
        claims: {
            address: address
        }
    };
    const poolInfoRequest =  getPoolInfo(contracts.pool);
    const holderRequest =  wasmStoreRequest(contracts.staking, holderMsg); 
    const claimsRequest = wasmStoreRequest(contracts.staking, claimMsg);
    const [poolInfo, holderInfo, claimInfo] = await Promise.all([poolInfoRequest, holderRequest,claimsRequest]);
    if(holderInfo?.balance && holderInfo?.balance !== "0") {
        const name = "LOTA Gov";
        const symbol = "LOTA";
        const lotaPrice = getPrice(poolInfo);
        const staked = div(holderInfo?.balance, UNIT);
        const value = times(staked, lotaPrice);
        const lotaRewards = getLotaRewards(claimInfo?.claims);
        const lotaRewardsValue = times(lotaRewards, lotaPrice);
        const ustRewards = holderInfo?.pending_rewards !== "0" ? div(holderInfo?.pending_rewards, UNIT) : '0';
        const ustRewardsInLota = div(ustRewards, lotaPrice);
        const rewards = plus(lotaRewards, ustRewardsInLota);
        const rewardsValue = plus(lotaRewardsValue, ustRewards);
        const apr = '0';
        const result = {name, symbol, staked, value, rewards, rewardsValue, apr, price: lotaPrice};
        return result;
    }
    return null;
    }
    catch(err){
        return null
    }
}