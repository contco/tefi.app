import { getTerraWorldStaking } from './staking';

export const getTWDAccount = async (address: string) => {
  try {
    const twdData = await getTerraWorldStaking(address)
    const {twdPool, twdGov} = twdData;      
    return { twdPool, twdGov };
  } catch {
    return { twdPool: null, twdGov: null };
  }
};
