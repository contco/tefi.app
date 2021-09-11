import { getAnchorAccount } from "../pages/api/anchor/lib/anc";
import { getMirrorAccount } from "../pages/api/mirror/getAccountData";
import { getLoterraAccount } from "../pages/api/loterra/lib";
import { getPylonAccount } from "../pages/api/pylon/getAccountData";
import { getTerraCoreAccount } from "../pages/api/terra-core/core";
import { getStarTerraAccount } from "../pages/api/starterra/lib/pools";
import { getSpectrumAccount } from "../pages/api/spectrum/lib";

const useAccounts = async (address:string) => {
    const anchor = await getAnchorAccount(address);
    const mirror = await getMirrorAccount(address);
    const loterra =await getLoterraAccount(address); 
    const pylon =await getPylonAccount(address);
    const spectrum =await getSpectrumAccount(address);
    const starterra =await getStarTerraAccount(address)
    const core =await getTerraCoreAccount({ args: { address: address } });
    
    return {data:{assets:{...core,mirror, anchor, loterra, spectrum, starterra,pylon}}};
        
}
  
  export default useAccounts;