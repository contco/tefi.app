import Header from '../../components/Header';
import Head from 'next/head';
import styled, { keyframes } from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box, Text } from '@contco/core-ui';

const MainContainer = styled(Flex)`
  justify-content: center;
  align-items: center;
  ${css({
    height: ['calc(100vh - 130px)'],
  })}
`;

const Container = styled(Box)`
  align-items: center;
  justify-content: center;
`;

const TextContainer = styled(Flex)`
  justify-content: center;
  align-items: flex-end;
`;

const Supply = styled(Text)`
  font-weight: 500;
  text-align: center;
  ${css({
    fontSize: [11],
    letterSpacing: ['3px'],
    color: 'secondary',
  })}
`;

const Symbol = styled(Text)`
  font-weight: 500;
  text-align: center;

  ${css({
    fontSize: [3],
    letterSpacing: ['1px'],
    color: 'secondary',
  })}
`;

const FireBox = styled(Box)`
  padding-top: 35%;
  padding-bottom: 35%;
`;

const FlameAnimation = keyframes`
	0%,
  100% {
    opacity: 0;
    transform: translate3d(0, 0, 0) scale(0.75) rotate(0) scale(1);
  }
  25% {
    opacity: 0.35;
    transform: translate3d(0, -10%, 0) scale(1) rotate(-3deg) scale(1.05);
  }
  50% {
    opacity: 0.35;
    transform: translate3d(0, -4%, 0) scale(1) rotate(3deg) scale(1.1);
  }
  75% {
    opacity: 0.35;
    transform: translate3d(0, -20%, 0) scale(1) rotate(-3deg) scale(1.05);
  }
  99% {
    opacity: 0;
    transform: translate3d(0, -50%, 0) scale(0.8) rotate(0) scale(1);
  }
`;

const FlameBase = styled.span`
  position: absolute;
  text-align: center;
  left: 1%;
  right: 1%;
  z-index: 2;
  opacity: 0.8;
  ${css({
    fontSize: ['160px'],
  })};
`;

const Flame = styled.span`
  position: absolute;
  text-align: center;
  left: 1%;
  right: 1%;
  z-index: 2;
  animation-name: ${FlameAnimation};
  animation-duration: 2.5s;
  animation-iteration-count: infinite;
  transform: translate3d(0, 15px, 0) scale(0.75) rotate(0);
  animation-timing-function: ease-in;
  opacity: 0;
  z-index: 1;

  &:nth-child(2) {
    animation-delay: 0.5s;
  }

  &:nth-child(3) {
    animation-delay: 1s;
  }

  ${css({
    fontSize: ['160px'],
  })}
`;

const TimePeriods = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${(props: any) => (props.useTV ? '30px' : '0px')};

  ${css({
		px: ['20%'],
    paddingTop: ['60%'],
  })}
`;

const Time = styled.div`
  padding-bottom: 13px;
  font-weight: 500;
  border-bottom: ${(props: any) => (props.selected ? `3px solid ${props.theme.colors.secondary}` : 'node')};
  color: ${(props: any) => props.theme.colors.secondary};
  cursor: pointer;
`;

const AssetSupply: React.FC = ({ theme, changeTheme }: any) => {
  return (
    <>
      <Head>
        <title>Tefi App - Asset Supply</title>
      </Head>
      <Header theme={theme} changeTheme={changeTheme} />
      <MainContainer>
        <Container>
          <TextContainer>
            <Supply>2034</Supply>
            <Symbol>LUNAS</Symbol>
          </TextContainer>
          <FireBox>
            <Text>
              <FlameBase>🔥</FlameBase>
              <Flame>🔥</Flame>
              <Flame>🔥</Flame>
              <Flame>🔥</Flame>
            </Text>
          </FireBox>
          <TimePeriods>
            <Time>HOUR</Time>
            <Time>DAY</Time>
          </TimePeriods>
        </Container>
      </MainContainer>
    </>
  );
};

export default AssetSupply;
