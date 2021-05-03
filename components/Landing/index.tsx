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

const Landing: React.FC = () => {
  const { connect, wallet } = useConnectWallet();

  return (
    <Container>
      <Title>
        Your portal to
        <Tefi>&nbsp;TeFi</Tefi>
      </Title>

      <ConnectButton onClick={wallet ? undefined : connect}>
        {wallet ? (
          <ConnectText>{wallet?.address.slice(0, 20) + '...'}</ConnectText>
        ) : (
          <ConnectText>Connect Terra Station</ConnectText>
        )}
      </ConnectButton>

      <OrText>or</OrText>

      <AddressContainer>
        <AddressInput placeholder="Terra Address" />
        <AddressSubmit>
          <AddressSubmitText>Submit</AddressSubmitText>
        </AddressSubmit>
      </AddressContainer>
    </Container>
  );
};

export default Landing;
