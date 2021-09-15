import { getAnchorAccount } from "../pages/api/anchor/lib/anc";
import { getMirrorAccount } from "../pages/api/mirror/getAccountData";
import { getLoterraAccount } from "../pages/api/loterra/lib";
import { useState, useEffect } from 'react';
import { getPylonAccount } from "../pages/api/pylon/getAccountData";
import { getTerraCoreAccount } from "../pages/api/terra-core/core";
import { getStarTerraAccount } from "../pages/api/starterra/lib/pools";
import { getSpectrumAccount } from "../pages/api/spectrum/lib";
import { getApolloDaoAccount } from "../pages/api/apollo/lib";

const useAccounts = (address:string) => {
    const [loading, setLoading] = useState(true);
    const [data,setData] = useState(null);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing]= useState(false);
    const fetch = async ()  => {
      try {
        const anchor = await getAnchorAccount(address);
        const mirror = await getMirrorAccount(address);
        const loterra =await getLoterraAccount(address); 
        const pylon =await getPylonAccount(address);
        const spectrum =await getSpectrumAccount(address);
        const starterra =await getStarTerraAccount(address)
        const core =await getTerraCoreAccount({ args: { address: address } });
        const apollo = await getApolloDaoAccount(address);
  
        if(anchor && mirror && loterra && pylon && spectrum && starterra && core && apollo){
          setData({assets:{...core,mirror, anchor, loterra, spectrum, starterra, pylon, apollo}})
        }
      } catch (error) {
        setError(error);
      }
      finally {
        setLoading(false);
        setRefreshing(false);
      }
    }
    const refetch = () => {
      setRefreshing(true);
      fetch();
    }
    useEffect(() => {
      if(data !== null){
        setLoading(false);
      }
    }, [data])
    useEffect(() => {
      if(address){
        fetch();
    }
 }, [address])
    
    return  {data, loading, fetch, refetch, error, refreshing};
        
}
  
  export default useAccounts;