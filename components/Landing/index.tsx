import {
  Container,
  Title,
  Tefi,
  ConnectButton,
  ConnectText,
  OrText,
  AddressContainer,
  AddressInput,
  AddressSubmit,
  AddressSubmitText,
  WarningText,
  Row,
} from './style';
import { isMobile } from 'react-device-detect';
import useWallet from '../../lib/useWallet';
import { AccAddress } from '@terra-money/terra.js';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '../Footer';
import ConnectModal from '../ConnectModal';
import { NextSeo } from 'next-seo';
import { landingSEO } from '../../next-seo.config';

import { ADDRESS_KEY, WalletConnectType } from '../../constants';

const Landing: React.FC = () => {
  const [address, setAddress] = useState<string>(null);
  const [showModal, setModalVisible] = useState<boolean>(false);

  const [mobile, setMobile] = useState<boolean>(false);

  const { onConnect, useConnectedWallet } = useWallet();
  const connectedWallet = useConnectedWallet();

  useEffect(() => {
     setMobile(isMobile);
  }, [isMobile]);



  const handleAddress = (e: any) => {
    e.preventDefault();
    setAddress(e.target.value);
  };

  const router = useRouter();

  const validWalletAddress = useMemo(() => AccAddress.validate(address), [address]);

  const onAddressSubmit = () => {
    localStorage.setItem(ADDRESS_KEY, address);
    router.push('/dashboard');
  };

  const getWarningText = () => {
    if (address) {
      if (validWalletAddress) {
        return 'Valid Terra Address';
      } else return '* Terra Address is Invalid';
    }
  };

  const onTypeSelect = (type: WalletConnectType) => {
    onConnect(type);
    setModalVisible(false);
  };

  return (
    <>
      <Container>
        <NextSeo {...landingSEO} />
        <Title>
          Your portal to
          <Tefi>&nbsp;TeFi</Tefi>
        </Title>

        <ConnectButton
          onClick={mobile ? () => onTypeSelect(WalletConnectType.Mobile) : () => setModalVisible(!showModal)}
        >
          {connectedWallet?.terraAddress ? (
            <ConnectText>Connected</ConnectText>
          ) : (
            <ConnectText>Connect Wallet</ConnectText>
          )}
        </ConnectButton>

        <OrText>or</OrText>
        <AddressContainer>
          <Row>
            <AddressInput defaultValue={address} onChange={handleAddress} placeholder="Enter a Terra address" />
            <WarningText>{getWarningText()}</WarningText>
          </Row>
          <Row>
            <AddressSubmit disabled={!validWalletAddress} onClick={onAddressSubmit}>
              <AddressSubmitText>Submit</AddressSubmitText>
            </AddressSubmit>
          </Row>
        </AddressContainer>
        {!isMobile && <Footer />}
      </Container>
      <ConnectModal showModal={showModal} setModalVisible={setModalVisible}/> 
    </>
  );
};

export default Landing;
