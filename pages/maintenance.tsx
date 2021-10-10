import Header from '../components/Header';
import { Flex, Text, Box } from '@contco/core-ui';
import styled from 'styled-components';
import {css} from "@styled-system/css"
import Head from 'next/head';
import React from 'react';
import { AnimatedCircle } from '../components/NftComponent';

const Container = styled(Flex)`
justify-content: center;
align-items: center;
${css({
  height: ['calc(100vh - 300px)'],
})}
`;

export const Title = styled(Text)`
  ${(props) =>
    css({
      color: props.theme.colors.Heading,
      fontWeight: 500,
      mt: 4,
      fontSize: ['20px', null, null, '24px'],
    })}
`;




const Col5: React.FC = ({ theme, changeTheme }: any) => {
  return (
    <>
      <Head>
        <title>Tefi App - Col-5 Update</title>
      </Head>
      <Header theme={theme} changeTheme={changeTheme} />
       <Container>
         <Box mt={10}>
          <AnimatedCircle currentTheme={theme} isBig />
          <Title>Site Under Maintenance</Title>
         </Box>
       </Container>
    </>
  );
};

export default Col5;
