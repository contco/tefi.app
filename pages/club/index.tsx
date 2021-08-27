import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box } from '@contco/core-ui';
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

const ADDRESS = 'terra1lpccq0w9e36nlzhx3m6t8pphx8ncavslyul29g';
const SEND_AMOUNT = '0.1';

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`;

const InnerContainer = styled(Container)`
  ${css({
    width: ['90%', null, null, null, 700, 800],
    px: 2,
  })}
`;

const TopSection = styled(Container)`
  ${css({
    width: '100%',
    mt: [60, null, null, 80],
    mb: [60, null, null, 99],
  })}
`;

const ConnectButton = styled(Flex)`
  ${css({
    py: 3,
    width: 240,
    borderRadius: 25,
    bg: 'secondary',
    color: 'primary',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease-out',
    fontWeight: 500,
    fontSize: 2,
    letterSpacing: 1,
    '&:hover': {
      opacity: 0.8,
    },
  })}
`;

const Feeds: React.FC = ({ theme: currentTheme, changeTheme, posts }: any) => {
  const [address, setAddress] = useState<string>();
  const [addressType, setAddressType] = useState<string>();
  const [showModal, setModalVisible] = useState<boolean>(false);
  const [feedPosts, setFeedPosts] = useState<any>(null);
  const { onConnect, useConnectedWallet, post } = useWallet();
  const connectedWallet = useConnectedWallet();
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile] = useState<boolean>(false);

  useEffect(() => {
     setMobile(isMobile);
  }, [isMobile]);


  useEffect(() => {
    if (posts) {
      setFeedPosts(posts);
    }
  }, []);

  const refetchPosts = async () => {
    setLoading(true);
    const latestPosts = await getPost();
    setLoading(false);
    latestPosts.length && setFeedPosts(latestPosts);
  };

  useEffect(() => {
    const walletAddress = connectedWallet?.terraAddress;
    if (walletAddress) {
      setAddress(walletAddress);
      setAddressType(WALLET_ADDRESS_TYPE);
    } else {
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
        to: ADDRESS,
        from: connectedWallet?.terraAddress,
        amount: SEND_AMOUNT,
        memo: text,
        denom: 'uusd',
      };
      const newFeedPost: txData = {
        to_address: ADDRESS,
        from_address: connectedWallet?.terraAddress,
        memo: text,
        block: null,
        txhash: null,
        timestamp: null,
      };
      const result = await sendNativeToken(transactionData, post);
      if (!result.error) {
        setFeedPosts([newFeedPost, ...feedPosts]);
      }
      return result;
    }
  };

  const onTypeSelect = (type: WalletConnectType) => {
    onConnect(type);
    setModalVisible(false);
  };

  return (
    <>
      <Head>
        <title>Tefi App - Club</title>
      </Head>
      <Header
        theme={currentTheme}
        changeTheme={changeTheme}
        addressType={addressType}
        address={address}
        onRefresh={refetchPosts}
        refreshing={loading}
      />
      <Container>
        <InnerContainer>
          <TopSection>
            {!address ? (
              <ConnectButton
                onClick={mobile ? () => onTypeSelect(WalletConnectType.Mobile) : () => setModalVisible(!showModal)}
              >
                Connect Wallet
              </ConnectButton>
            ) : (
              <Create onPost={onPost} />
            )}
          </TopSection>
          <Posts data={feedPosts} />
        </InnerContainer>
        <ConnectModal showModal={showModal} setModalVisible={setModalVisible} />
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
