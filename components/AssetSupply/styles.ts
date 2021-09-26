import styled, { keyframes } from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box, Text } from '@contco/core-ui';

export const MainContainer = styled(Flex)`
  justify-content: center;
  align-items: center;
  ${css({
    height: ['calc(100vh - 80px)'],
  })}
`;

export const Container = styled(Box)`
  align-items: center;
  justify-content: center;
`;

export const TextContainer = styled(Flex)`
  justify-content: center;
  align-items: flex-end;
`;

export const Supply = styled(Text)`
  font-weight: 500;
  text-align: center;
  ${css({
    fontSize: [4, 6, null, 9, null, null, 11],
    letterSpacing: ['3px'],
    color: 'secondary',
  })}
`;

export const Symbol = styled(Text)`
  font-weight: 500;
  text-align: center;

  ${css({
    fontSize: [0, null, 2, null, 3],
    letterSpacing: ['1px'],
    color: 'secondary',
  })}
`;

export const FireBox = styled(Box)`
  ${css({
    paddingTop: ['80px', null, '100px'],
  })}
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

export const FlameBase = styled.span`
  position: absolute;
  text-align: center;
  left: 1%;
  right: 1%;
  z-index: 2;
  opacity: 0.8;
  ${css({
    fontSize: ['100px', null, '130px', null, '160px'],
  })};
`;

export const Flame = styled.span`
  position: absolute;
  text-align: center;
  left: 20%;
  right: 20%;
  z-index: 2;
  animation-name: ${FlameAnimation};
  animation-duration: 2s;
  animation-iteration-count: infinite;
  transform: translate3d(0, 10px, 0) scale(0.75) rotate(0);
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
    fontSize: ['100px', null, '130px', null, '160px'],
  })}
`;

export const TimePeriods = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  ${css({
    width: ['90vw', '80vw', null, '65vw', null, null, null, null, null, '40vw'],
    paddingTop: ['200px', null, '300px'],
  })}
`;

export const Time = styled<any>(Box)`
  padding-bottom: 13px;
  font-weight: 500;
  border-bottom: ${(props: any) => (props.selected ? `3px solid ${props.theme.colors.secondary}` : 'node')};
  cursor: pointer;
  ${css({
    fontSize: [0, null, 2],
    color: 'secondary',
  })}
`;
