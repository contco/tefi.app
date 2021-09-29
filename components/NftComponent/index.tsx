import styled from 'styled-components';
import css from '@styled-system/css';
import { Text, Flex, Box } from '@contco/core-ui';
import { Logo } from './AnimatedCircle';

const MainContainer = styled(Flex)`
  justify-content: center;
  align-items: center;
  ${css({
    height: ['calc(100vh - 300px)'],
  })}
`;

const Container = styled(Box)`
  align-items: center;
  justify-content: center;
`;

const BigCircle = styled(Flex)`
  border-radius: 50%;
  align-items: flex-start;
  justify-content: center;
  margin: 0 auto;
  ${css({
    width: ['170px', null, '200px'],
    height: ['170px', null, '200px'],
    bg: 'secondary',
  })};
`;

const BigText = styled(Text)`
  font-weight: 900;
  letter-spacing: 0.77px;

  ${css({
    fontSize: ['30px', null, '40px', '60px', null, null, null, '60px'],
    mt: [8],
    color: 'Heading',
  })}
`;

interface Props {
  currentTheme: string;
}

const NftComponent: React.FC<Props> = ({ currentTheme }) => {
  return (
    <MainContainer>
      <Container>
        <BigCircle>
          <Logo width="100%" currentTheme={currentTheme} />
        </BigCircle>
        <Box>
          <BigText>COMING SOON</BigText>
        </Box>
      </Container>
    </MainContainer>
  );
};

export default NftComponent;
