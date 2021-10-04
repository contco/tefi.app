import { getTerrWorldASsets } from './getTerraWorldAssets';

export const getTWDAccount = async (address: string) => {
  try {
    const twdData = await getTerrWorldASsets(address)
    const {twdHoldings, twdPool, twdGov} = twdData;      
    return {twdHoldings, twdPool, twdGov };
  } catch {
    return {twdHoldings:null, twdPool: null, twdGov: null };
  }
};
