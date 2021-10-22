import axios from 'axios';
import { wasmStoreRequest } from '@contco/terra-utilities';
import { LCD_URL } from '../../utils';

export const BLOCK_TIME = 6500;
export const HEIGHT_PER_YEAR = (365 * 24 * 60 * 60 * 1000) / BLOCK_TIME;

export function fromEntries<T>(entries: [string, T][]) {
  return entries.reduce((a, [k, v]) => ((a[k] = v), a), {} as Record<string, T>);
}

export const getPairPool = async (contract: string) => {
  const { data: pairPool } = await axios.get(LCD_URL + `wasm/contracts/${contract}/store`, {
    params: {
      query_msg: JSON.stringify({
        pool: {},
      }),
    },
  });
  return pairPool?.result;
};

export const createPairStats = (poolApr, token, poolInfos, govWeight, totalWeight, farmApr) => {
  const poolInfo = poolInfos[token];
  const stat = {
    poolApr,
    poolApy: (poolApr / 365 + 1) ** 365 - 1,
    farmApr,
    tvl: '0',
    multiplier: poolInfo ? (govWeight * poolInfo.weight) / totalWeight : 0,
    vaultFee: 0,
  };
  return stat;
};

export const getFarmConfig = (contract_addr: string) => {
  const query_msg = { config: {} };
  const result = wasmStoreRequest(contract_addr, query_msg);
  return result;
};

export const getRewardInfos = async (height: string, query_contract: string, staking_contract: string) => {
  const query_msg = {
    staker_info: {
      block_height: +height,
      staker: query_contract,
    },
  };

  const result = wasmStoreRequest(staking_contract, query_msg);
  return result;
};
