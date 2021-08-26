import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import Create from '../../components/Feed/Create';
import Posts from '../../components/Feed/Posts';
import Header from '../../components/Header';
import { ADDRESS_KEY, LOCAL_ADDRESS_TYPE, WALLET_ADDRESS_TYPE } from '../../constants';
import useWallet from '../../lib/useWallet';
import { sendNativeToken } from '../../transactions/sendToken';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${css({
    width: ['90%', '90%', '90%', null, '50%'],
  })}
`;

const Feeds: React.FC = ({ theme: currentTheme, changeTheme, data: d }: any) => {
  const [address, setAddress] = useState<string>();
  const [addressType, setAddressType] = useState<string>();
  const { useConnectedWallet, post } = useWallet();
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

  const onPost = ({ text }) => {
    const walletAddress = connectedWallet?.terraAddress;
    if (walletAddress) {
      setAddress(walletAddress);
      setAddressType(WALLET_ADDRESS_TYPE);
      const transactionData = {
        to: 'terra15s0q4u4cpvsxgyygm7wy70q9tq0nnr8fg0m0q3',
        from: connectedWallet?.terraAddress,
        amount: '0.1',
        memo: text,
        denom: 'uusd',
      };
      alert(text)
      sendNativeToken(transactionData, post);
    }
  };

  return (
    <>
      <Header theme={currentTheme} changeTheme={changeTheme} addressType={addressType} address={address} />
      <MainContainer>
        <InnerContainer>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <p>{`address: ${address}`}</p>
            <p>{`addressType: ${addressType}`}</p>
          </div>
          <Create onPost={onPost} />
          <Posts />
        </InnerContainer>
      </MainContainer>
    </>
  );
};

export default Feeds;
