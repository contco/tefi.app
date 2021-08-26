import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Create from '../../components/Feed/Create';
import Posts from '../../components/Feed/Posts';
import Header from '../../components/Header';
import { ADDRESS_KEY, LOCAL_ADDRESS_TYPE, WALLET_ADDRESS_TYPE } from '../../constants';
import useWallet from '../../lib/useWallet';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Feeds: React.FC = ({ theme: currentTheme, changeTheme, data: d }: any) => {
  const [address, setAddress] = useState<string>();
  const [addressType, setAddressType] = useState<string>();
  const { useConnectedWallet } = useWallet();
  const connectedWallet = useConnectedWallet();

  useEffect(() => {
    const localAddress = localStorage.getItem(ADDRESS_KEY);
    const walletAddress = connectedWallet?.terraAddress;
    if (localAddress) {
      setAddress(localAddress);
      setAddressType(LOCAL_ADDRESS_TYPE);
    } else if (walletAddress) {
      setAddress(walletAddress);
      setAddressType(WALLET_ADDRESS_TYPE);
    }
  }, []);

  return (
    <>
      <Header theme={currentTheme} changeTheme={changeTheme} addressType={addressType} address={address} />
      <MainContainer>
        <Create />
        <Posts />
        <p>{`address: ${address}`}</p>
        <p>{`addressType: ${addressType}`}</p>
      </MainContainer>
    </>
  );
};

export default Feeds;
