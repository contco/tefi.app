import { getAnchorAccount } from "../pages/api/anchor/lib/anc";
import { getMirrorAccount } from "../pages/api/mirror/getAccountData";
import { getLoterraAccount } from "../pages/api/loterra/lib";
import React, { useState, useEffect } from 'react';
import { getPylonAccount } from "../pages/api/pylon/getAccountData";
import { getTerraCoreAccount } from "../pages/api/terra-core/core";
import { getStarTerraAccount } from "../pages/api/starterra/lib/pools";
import { getSpectrumAccount } from "../pages/api/spectrum/lib";

const useAccounts = (address:string) => {
    const [loading, setLoading] = useState(true);
    const [data,setData] = useState(null);

    useEffect(() => {
      if(data !== null){
        setLoading(false);
      }
    }, [data])
 useEffect(() => {
  const fetch = async ()  => {
    const anchor = await getAnchorAccount(address);
    const mirror = await getMirrorAccount(address);
    const loterra =await getLoterraAccount(address); 
    const pylon =await getPylonAccount(address);
    const spectrum =await getSpectrumAccount(address);
    const starterra =await getStarTerraAccount(address)
    const core =await getTerraCoreAccount({ args: { address: address } });

    if(anchor && mirror && loterra && pylon && spectrum && starterra && core){
      console.log(core)
      setData({assets:{...core,mirror, anchor, loterra, spectrum, starterra,pylon}})
    }
  }
  if(address){
    fetch()
  }
 }, [address])
    
    return  {data, loading};
        
}
  
  export default useAccounts;