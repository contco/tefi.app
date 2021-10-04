import Header from '../components/Header';
import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import { Flex, Text } from '@contco/core-ui';
import { AnimatedCircle } from '../components/NftComponent';
import css from '@styled-system/css';
import AnimatedCircleTrail from '../components/Animations/AnimatedCircleTrail';

const TEXT = 'Membership not for sale';

const Container = styled(Flex)`
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const SubText = styled(Text)`
  font-weight: 600;
  letter-spacing: 0.77px;
  ${css({
    fontSize: ['20px', null, '25px', '30px', null, null, null, '30px'],
    color: 'Heading',
  })}
`;

const BigText = styled(Text)`
  font-weight: 900;
  letter-spacing: 0.77px;
  ${css({
    fontSize: ['30px', null, '40px', '60px', null, null, null, '90px'],
    color: 'Heading',
  })}
`;

const DAO: React.FC = ({ theme, changeTheme }: any) => {
  return (
    <>
      <Head>
        <title>TeFiDao</title>
      </Head>
      <Header theme={theme} changeTheme={changeTheme} logoSub="DAO" />
      <Container>
        <BigText>community.</BigText>
      </Container>
      <AnimatedCircleTrail />
    </>
  );
};

export default DAO;
