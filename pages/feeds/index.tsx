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
import { getPost } from '../api/feed/posts';

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center; 
`;

const InnerContainer = styled(Container)`
  ${css({
    width: ['90%', null, null, null, 700, 800],
  })}
`;

const TopSection = styled(Container)`
  ${css({
    width: '100%',
    mt: [60, null, null, 80],
    mb: [60,null, null, 134],
  })}

`;

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

const Feeds: React.FC = ({ theme: currentTheme, changeTheme, posts }: any) => {
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
      alert(text);
      sendNativeToken(transactionData, post);
    }
  };

  return (
    <>
      <Header theme={currentTheme} changeTheme={changeTheme} addressType={addressType} address={address} />
      <Container>
      <InnerContainer>
        <TopSection>
          {address ? 
            <ConnectButton>Connect Wallet</ConnectButton>
          :     
          <Create onPost={onPost} />
          } 
        </TopSection>   
         <Posts data={posts}/>
        </InnerContainer>
      </Container>
    </>
  );
};

export async function getServerSideProps() {
  const posts = await getPost();
  return {
    props: {
      posts,
    },
  };
}

export default Feeds;
