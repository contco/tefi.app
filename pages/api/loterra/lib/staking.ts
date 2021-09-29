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

    const poolInfoRequest = getPoolInfo(contracts.pool);
    const holderRequest = wasmStoreRequest(contracts.staking, holderMsg);
    const claimsRequest = wasmStoreRequest(contracts.staking, claimMsg);
    const lpTokenRequest = wasmStoreRequest(contracts.loterraLPAddress, LpTokenMsg);
    const holderLP = wasmStoreRequest(contracts.loterraStakingLPAddress, holderLPMsg);

    const [
      poolInfo,
      holderInfo,
      claimInfo,
      lpTokenInfo,
      holderLPInfo
    ] = await Promise.all([
      poolInfoRequest,
      holderRequest,
      claimsRequest,
      lpTokenRequest,
      holderLP
    ]);

    const lotaPool = getLpStakingInfo(poolInfo, lpTokenInfo, holderLPInfo);
    const lotaGov = getGovInfo(holderInfo, poolInfo, claimInfo);
    return { lotaGov, lotaPool };
  } catch (err) {
    return null;
  }
};
