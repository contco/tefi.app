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
} from './style';

import  useWallet from '../../lib/useWallet';
import { AccAddress } from '@terra-money/terra.js';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import {ADDRESS_KEY} from "../../constants";

const Landing: React.FC = () => {
  const { onConnect, connectedWallet } = useWallet();

  const [address, setAddress] = useState<string>(null);

  const handleAddress = (e: any) => {
    e.preventDefault();
    setAddress(e.target.value);
  };

  const router = useRouter();
  
  useEffect(() => {
    if(connectedWallet?.terraAddress) {
      router.push('/dashboard');
    }
  }, [connectedWallet?.terraAddress]);


  const validWalletAddress = useMemo(() => AccAddress.validate(address), [address]);


  const onAddressSubmit = () => {
    localStorage.setItem(ADDRESS_KEY, address);
    router.push('/dashboard');
  };



  return (
    <Container>
      <Title>
        Your portal to
        <Tefi>&nbsp;TeFi</Tefi>
      </Title>

      <ConnectButton onClick={connectedWallet?.terraAddress ? undefined : onConnect}>
        {connectedWallet?.terraAddress  ? (
          <ConnectText>
           Connected
          </ConnectText>
        ) : (
          <ConnectText>Connect Terra Station</ConnectText>
        )}
      </ConnectButton>

      <OrText>or</OrText>

      <AddressContainer>
        <AddressInput defaultValue={address} onChange={handleAddress} placeholder="Terra Address" />
        <AddressSubmit
          disabled={!validWalletAddress}
          onClick={onAddressSubmit}
        >
          <AddressSubmitText>Submit</AddressSubmitText>
        </AddressSubmit>
      </AddressContainer>
    </Container>
  );
};

export default Landing;
