import React from 'react';
import { Flex, Text, Button } from '@contco/core-ui';
import css from '@styled-system/css';
import styled from 'styled-components';

const Container = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  ${css({})}
`;

const Title = styled(Text)`
  font-weight: 900;
  display: flex;
  align-items: flex-end;
  ${css({
    color: '#000',
    fontSize: 50,
    letterSpacing: 2.5,
  })}
`;

const Tefi = styled(Text)`
  ${css({
    color: 'secondary',
    fontSize: 66,
    letterSpacing: 2.75,
  })}
`;

const ConnectButton = styled(Button)`
  border-radius: 34.5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 5%;
  ${css({
    border: 'solid 1px #0221ba',
    bg: 'primary',
    width: 323,
    height: 69,
  })}
`;

const ConnectText = styled(Text)`
  font-weight: 500;
  ${css({
    fontSize: 20,
    letterSpacing: '0.83px',
    color: 'secondary',
  })}
`;

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
    </Container>
  );
};

export default Landing;
