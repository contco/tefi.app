import { div } from '../../../../utils/math';
import { UNIT } from '../../mirror/utils';
import { getTWDConfig } from './config';
import { getTerraWorldStaking } from './staking';

export const getTWDAccount = async (address: string) => {
  try {
    const [loterraConfig, lotaData] = await Promise.all([getTWDConfig(), getTerraWorldStaking(address)]);
    const {lotaGov, lotaPool} = lotaData;

    console.log('lotaGov', lotaGov);
    console.log('lotaPool', lotaPool);
        
    return { lotaGov, lotaPool };
  } catch {
    return { loterraDraw: null, lotaGov: null, lotaPool: null };
  }
};
