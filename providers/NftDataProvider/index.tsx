import React, { ReactNode, createContext, useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import useWallet from '../../lib/useWallet';
import { useDgraphClient } from '../../lib//dgraphClient';
import {GET_PROFILE_NFT} from '../../graphql/queries/getProfileNFT';
import { ADD_PROFILE_NFT } from '../../graphql/mutations/addProfileNft';
import { UPDATE_PROFILE_NFT } from '../../graphql/mutations/updateProfileNft';
import { ADDRESS_KEY } from '../../constants';
import useFee from '../../utils/useFee';

interface ContextProps {
  profileNft: ProfileNft;
  profileNftLoading: boolean;
  saveProfileNft: (url: string, tokenId: string) => void;
  saveProfileNftLoading: boolean;
  initialLoading: boolean;
  nftAssets: any;
}

interface Props {
  children: ReactNode;
}

const NftContext = createContext<ContextProps>({
  profileNftLoading: false,
  profileNft: null,
  saveProfileNft: null,
  saveProfileNftLoading: false,
  initialLoading: false,
  nftAssets: null,
});

const NftDataProvider: React.FC<Props> = ({ children }) => {
  const [profileNft, setProfileNft] = useState<ProfileNft | null>(null);
  const { useConnectedWallet } = useWallet();
  const connectedWallet = useConnectedWallet();
  const localAddress = localStorage.getItem(ADDRESS_KEY);
  const [randomEarthData, setRandomEarthData] = useState(null);
  const [nftAssets, setNftAssets] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [fetchProfileNFT, { data: profileNftData, called: profileNftCalled, loading }] = useLazyQuery(GET_PROFILE_NFT, {client: useDgraphClient()});
  
  const [addProfileNft, {loading: addProfileLoading}] = useMutation(ADD_PROFILE_NFT, {client: useDgraphClient()});
  const [updateProfileNft, {loading: updateProfileLoading}] = useMutation(UPDATE_PROFILE_NFT, {client: useDgraphClient()});

  const profileNftLoading = !profileNftCalled || loading;
  const saveProfileNftLoading = addProfileLoading || updateProfileLoading;


  const saveProfileNft = async (url: string, tokenId: string) => {
    if(!profileNftLoading) {
       if(profileNft && profileNft?.address) {
           if(profileNft.tokenId === tokenId) {
            await updateProfileNft({variables: {input: {filter: {address: {eq: connectedWallet?.terraAddress}}, set: {url: "", tokenId: ""}}}});
            setProfileNft({...profileNft, tokenId: "", url: ""})
           }
          else {
            await updateProfileNft({variables: { input: {filter: {address: {eq: connectedWallet.terraAddress }},set: {url, tokenId}}}});
            setProfileNft({...profileNft, tokenId, url})
          }   
       }
       else {
         await addProfileNft({variables: {address: connectedWallet?.terraAddress, url, tokenId}});
         setProfileNft({...profileNft, tokenId, url})
       }
    }
  }

  useEffect(() => {
  
    const fetchRandomEarthNftData = async(addr) => {
      try {
        const jsonResponse = await fetch(`/api/nft/${addr}`);
        const result = await jsonResponse.json();
        setRandomEarthData(result);
      }
      catch(err){
        setRandomEarthData(null);
      }
      setInitialLoading(false);
    }

    const walletAddress = connectedWallet?.terraAddress;
    if (walletAddress) {
      fetchProfileNFT({variables: {address: walletAddress}})
      fetchRandomEarthNftData(walletAddress);
    }
    else if(localAddress && localAddress !== "") {
      fetchProfileNFT({variables: {address: localAddress}});
      fetchRandomEarthNftData(localAddress);
    }
    else {
        setProfileNft(null);
    }
  }, [connectedWallet, localAddress]);

  
  useEffect(() => { 
    const randomEarthNfts = randomEarthData?.items ? randomEarthData?.items : [];
    const knowhereNfts = profileNft?.nftAssets ? profileNft?.nftAssets : [];
    console.log(typeof(profileNft), profileNft?.nftAssets)
    console.log(randomEarthNfts)
    console.log(knowhereNfts, profileNft, "aaa112");

    const nftList = [...randomEarthNfts, ...knowhereNfts];
    setNftAssets(nftList);
    
  }, [randomEarthData, profileNft?.nftAssets]);


  useEffect(() => {
     setProfileNft(profileNftData?.getProfileNft)
  }, [profileNftData]);

  return (
    <NftContext.Provider value={{ profileNftLoading, profileNft, saveProfileNft, saveProfileNftLoading, initialLoading, nftAssets}}>{children}</NftContext.Provider>
  );
};

export default NftDataProvider;

export function useNftContext(): ContextProps {
  const context = React.useContext(NftContext);
  if (context === undefined) {
    throw new Error('useNftContext must be used within NftDataProvider');
  }
  return context;
}
