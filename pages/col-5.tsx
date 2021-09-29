import Header from '../components/Header';
import Head from 'next/head';
import React from 'react';
import NftComponent from '../components/NftComponent';
import styled from 'styled-components';
import { Flex } from '@contco/core-ui';

const TEXT = 'WEN COL-5? NOW!';

const Container = styled(Flex)`
  justify-content: center;
  align-items: center;
  height: 90vh;
`;

const Supply: React.FC = ({ theme, changeTheme }: any) => {
  return (
    <>
      <Head>
        <title>Tefi App - Col-5 Update</title>
      </Head>
      <Header theme={theme} changeTheme={changeTheme} hideMenu />
      <Container>
        <NftComponent currentTheme={theme} text={TEXT} isBig />
      </Container>
    </>
  );
};

export default Supply;
