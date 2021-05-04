import React from 'react';
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

const Landing: React.FC = () => {
  return (
    <Container>
      <Title>
        Your portal to
        <Tefi>&nbsp;TeFi</Tefi>
      </Title>

      <ConnectButton>
        <ConnectText>Connect Terra Station</ConnectText>
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
