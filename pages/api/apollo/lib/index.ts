import {fetchVaultsData} from './vaults';

export const getApolloDaoAccount = async (address: string) => {
  const {vaultData, vaultTotal} = await fetchVaultsData(address);
  return {vaults: vaultData, total: vaultTotal};
}