import React from 'react';
import { Flex, Box } from '@contco/core-ui';
import styled from 'styled-components';
import { AnimatedCircle } from './NftComponent';

interface Props {
  height?: string;
  width?: string;
  currentTheme?: string;
}
const MainContainer = styled(Flex)`
  height: ${(props: any) => props.height || '65vh'};
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Container = styled(Box)`
  align-items: center;
  justify-content: center;
`;

const Text = styled.p`
  margin-top: 39px;
  color: ${(props) => props.theme.colors.secondary};
  font-weight: 500;
`;

const Loading: React.FC<Props> = ({ height = '65vh', currentTheme }) => {
  return (
    <MainContainer height={height}>
      <Container>
        <AnimatedCircle currentTheme={currentTheme} />
      </Container>
      <Text>searching the cosmos...</Text>
    </MainContainer>
  );
};

export default Loading;
