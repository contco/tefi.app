import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box} from '@contco/core-ui';
import { isMobile } from 'react-device-detect';
import Create from '../../components/Feed/Create';
import Posts from '../../components/Feed/Posts';
import Header from '../../components/Header';
import { WALLET_ADDRESS_TYPE } from '../../constants';
import useWallet from '../../lib/useWallet';
import { sendNativeToken } from '../../transactions/sendToken';
import { getPost } from '../api/feed/posts';
import ConnectModal from '../../components/ConnectModal';
import { WalletConnectType } from '../../constants';
import { fetchTx } from '../../transactions/fetchTx';

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center; 
  overflow-x: hidden;
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
  const [showModal, setModalVisible] = useState<boolean>(false);
  const [feedPosts, setFeedPosts] = useState<any>(null);
  const { onConnect, useConnectedWallet, post } = useWallet();
  const connectedWallet = useConnectedWallet();

  useEffect(() => {
     if(posts){
       setFeedPosts(posts);
     }
  }, []);

  useEffect(() => {
    const walletAddress = connectedWallet?.terraAddress;
     if(walletAddress) {
      setAddress(walletAddress);
      setAddressType(WALLET_ADDRESS_TYPE);
    }
    else {
      setAddress(null);
      setAddressType(null);
    }
  }, [connectedWallet?.terraAddress]);


  const onPost = async ({ text }) => {
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
      const result = await sendNativeToken(transactionData, post);
      if(result?.error) {
        alert(result?.msg);
      }
      else {
        setTimeout( async () => {
        const txHash = result?.result?.txhash;
        const txPost: any = await fetchTx(txHash);
        if(!txPost?.error) {
          setFeedPosts([txPost,...feedPosts]);
        }
        }, 7000);
      }
    }
  };


  const onTypeSelect = (type: WalletConnectType) => {
    onConnect(type);
    setModalVisible(false);
  };

  return (
    <>
      <Header theme={currentTheme} changeTheme={changeTheme} addressType={addressType} address={address} />
      <Container>
      <InnerContainer>
        <TopSection>
          {!address ? 
            <ConnectButton onClick={isMobile ? () => onTypeSelect(WalletConnectType.Mobile) : () => setModalVisible(!showModal)}>Connect Wallet</ConnectButton>
          :     
          <Create onPost={onPost} />
          } 
        </TopSection>   
         <Posts data={feedPosts}/>
        </InnerContainer>
        <ConnectModal showModal={showModal} setModalVisible={setModalVisible}/> 
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
