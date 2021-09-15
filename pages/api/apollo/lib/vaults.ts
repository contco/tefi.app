import {wasmStoreRequest} from '../../commons/wasm';
import {apolloDaoContracts} from './contracts';
import { pairInfoList } from '../../spectrum/lib/pairInfoList';
import { getPoolInfo } from '../../commons';
import { getLpValue } from '../../utils';
import { getPrice } from '../../commons';
import { UNIT } from '../../mirror/utils';
import { getPoolSymbol } from './getPoolSymbol';

const pairInfoByLiquidityToken = Object.values(pairInfoList).reduce((acm, item) => ({[item.liquidity_token]: item, ...acm}), {});

const FETCH_LIMIT = 12;
 
const getQueryMsg =  (start_from: number, address = "", type = 'default') => {
    if (type === "user") {
      return ({
        get_user_strategies: {
            user: address,
            limit: FETCH_LIMIT,
            start_from: start_from
        }
      });
    }
    else {
      return ({
        get_strategies: {
            limit: FETCH_LIMIT,
            start_from: start_from
        }
      });
    }
}


const getVaultDetails = async () => {
    let fetchMore = true;
    let start_from = 1;
    const strategies = {};
    while (fetchMore) {
        const query_msg = getQueryMsg(start_from);
        const result = await wasmStoreRequest(apolloDaoContracts.vaultContract, query_msg);
        result?.strategies.forEach((strategy: any) => {
            strategies[strategy.id] = strategy;
        });

        if(result?.strategies.length === 12) {
            start_from = FETCH_LIMIT + start_from;
        }
        else {
            fetchMore = false
        }
    }
    return strategies;
} 

const getUserVaults = async (address: string) => {
  let fetchMore = true;
  let start_from = 1;
  let strategies = [];
  while (fetchMore) {
      const query_msg = getQueryMsg(start_from, address, "user");
      const result = await wasmStoreRequest(apolloDaoContracts.vaultContract,  query_msg);
      strategies = [...strategies, ...result?.strategies];
      if(result?.strategies.length === 12) {
          start_from = FETCH_LIMIT + start_from;
      }
      else {
          fetchMore = false
      }
  }
 const user_vaults = strategies.filter(item => item.base_token_balance !== "0");
 return user_vaults;
}

const getPoolResponses = async (vaultDetails: any, userVaults: any) => {
    const poolResponsePromises = userVaults.map(async (userVault: any) => {
      const vaultInfo = vaultDetails[userVault.id];
      const pairInfo = pairInfoByLiquidityToken[vaultInfo.base_token];
      const poolInfo = await getPoolInfo(pairInfo.contract_addr);
      return poolInfo;
    });
    const poolResponses = await Promise.all(poolResponsePromises);
    return poolResponses;
}

const calculateVaultData = (userVaults, poolResponses) => {
  let vaultTotal = 0;
  const vaultData = userVaults.map((userVault : any, index: number) => {
    const tokenPrice = getPrice(poolResponses[index]);
    const lpValue = getLpValue(poolResponses[index], parseFloat(tokenPrice));
    const stakedLp = parseFloat(userVault.base_token_balance) / UNIT;
    const stakedLpUstValue = lpValue * stakedLp;
    const poolSymbols = getPoolSymbol(poolResponses[index]);
    vaultTotal  = stakedLpUstValue + vaultTotal;
    return {stakedLp: stakedLp.toString(), stakedLpUstValue: stakedLpUstValue.toString(), ...poolSymbols};
  });

  return {vaultData, vaultTotal: vaultTotal.toString()};
}
export const fetchVaultsData = async (address: string) => {
  try {
  const [vaultDetails, userVaults] = await  Promise.all([getVaultDetails(), getUserVaults(address)]);
  const poolResponses = await getPoolResponses(vaultDetails, userVaults);
  const vaultsData = calculateVaultData(userVaults, poolResponses);
  return vaultsData
  }
  catch(err) {
    return ({vaultData: [], vaultTotal: '0'});
  }
}