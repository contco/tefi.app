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
  ModalBox,
  ModalTitle,
  ModalSection,
  WarningText,
  Row,
} from './style';
import { isMobile } from 'react-device-detect';
import useWallet from '../../lib/useWallet';
import { AccAddress } from '@terra-money/terra.js';
import { Modal } from '@contco/core-ui';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { ADDRESS_KEY, WalletConnectType } from '../../constants';

const Landing: React.FC = () => {
  const [address, setAddress] = useState<string>(null);
  const [showModel, setModelVisible] = useState<boolean>(false);

  const { onConnect, useConnectedWallet } = useWallet();
  const connectedWallet = useConnectedWallet();

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

  const onTypeSelect = (type: WalletConnectType) => {
    onConnect(type);
    setModelVisible(false);
  };

  const getWarningText = () => {
    if (address) {
      if (validWalletAddress) {
        return 'Valid Terra Address';
      } else return '* Terra Address is Invalid';
    }
  };

  return (
    <>
      <Container>
        <Title>
          Your portal to
          <Tefi>&nbsp;TeFi</Tefi>
        </Title>

        <ConnectButton
          onClick={isMobile ? () => onTypeSelect(WalletConnectType.Mobile) : () => setModelVisible(!showModel)}
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
      </Container>
      <Modal isOpen={showModel} onClose={() => setModelVisible(false)}>
        <ModalBox>
          <ModalTitle>Connect To A Wallet</ModalTitle>
          <ModalSection onClick={() => onTypeSelect(WalletConnectType.Extension)}>
            Terra Wallet (Extension)
          </ModalSection>
          <ModalSection onClick={() => onTypeSelect(WalletConnectType.Mobile)}>Terra Wallet (Mobile)</ModalSection>
        </ModalBox>
      </Modal>
    </>
  );
};

export default Landing;
