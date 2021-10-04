import { getTerrWorldASsets } from './getTerraWorldAssets';

export const getTWDAccount = async (address: string) => {
  try {
    const twdData = await getTerrWorldASsets(address)
    const {twdPool, twdGov} = twdData;      
    return { twdPool, twdGov };
  } catch {
    return { twdPool: null, twdGov: null };
  }
};
