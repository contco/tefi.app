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

import useConnectWallet from '../../lib/useConnectWallet';
import { AccAddress } from '@terra-money/terra.js';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';

const Landing: React.FC = () => {
  const { connect, wallet } = useConnectWallet();

  const [address, setAddress] = useState<string>(null);

  const handleAddress = (e: any) => {
    e.preventDefault();
    setAddress(e.target.value);
  };

  const validWalletAddress = useMemo(() => AccAddress.validate(address), [address]);

  const router = useRouter();

  return (
    <Container>
      <Title>
        Your portal to
        <Tefi>&nbsp;TeFi</Tefi>
      </Title>

      <ConnectButton onClick={wallet ? undefined : connect}>
        {wallet ? (
          <ConnectText>
            {wallet?.address?.slice(0, 11) +
              '....' +
              wallet?.address?.slice(wallet?.address?.length - 11, wallet?.address?.length)}
          </ConnectText>
        ) : (
          <ConnectText>Connect Terra Station</ConnectText>
        )}
      </ConnectButton>

      <OrText>or</OrText>

      <AddressContainer>
        <AddressInput value={address} onChange={handleAddress} placeholder="Terra Address" />
        <AddressSubmit
          disabled={!validWalletAddress}
          onClick={() => {
            router.push('/dashboard');
          }}
        >
          <AddressSubmitText>Submit</AddressSubmitText>
        </AddressSubmit>
      </AddressContainer>
    </Container>
  );
};

export default Landing;
