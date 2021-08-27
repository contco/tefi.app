import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box} from '@contco/core-ui';
import Create from '../../components/Feed/Create';
import Posts from '../../components/Feed/Posts';
import Header from '../../components/Header';
import { WALLET_ADDRESS_TYPE } from '../../constants';
import useWallet from '../../lib/useWallet';
import { sendNativeToken } from '../../transactions/sendToken';

const MainContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center; 
  background-color: green;
`;

const InnerContainer = styled(MainContainer)`
  ${css({
    width: ['90%', null, null, null, 700,  800],
  })}
`

const ConnectButton = styled(Flex)`
 ${css({
   py: 3,
   width: 240,
   borderRadius: 25,
   bg:'secondary',
   color: 'primary',
   justifyContent: 'center',
   cursor: 'pointer',
   transition: 'all 0.3s ease-out',
   fontWeight: 500,
   fontSize: 2,
   letterSpacing: 1,
   '&:hover': {
     opacity: 0.8,
   }
 })}
  
`;

const Feeds: React.FC = ({ theme: currentTheme, changeTheme }: any) => {
  const [address, setAddress] = useState<string>();
  const [addressType, setAddressType] = useState<string>();
  const { useConnectedWallet, post } = useWallet();
  const connectedWallet = useConnectedWallet();

  useEffect(() => {
    const walletAddress = connectedWallet?.terraAddress;
     if(walletAddress) {
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
        <Box mt={40} mb={104}>
          {!address ? 
            <ConnectButton>Connect Wallet</ConnectButton>
          :     
          <Create onPost={onPost} />
          } 
        </Box>   
         <Posts />
        </InnerContainer>
      </MainContainer>
    </>
  );
};

export default Feeds;
