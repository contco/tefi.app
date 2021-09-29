import React from 'react';
import { Flex } from '@contco/core-ui';
import css from '@styled-system/css';
import styled, { keyframes } from 'styled-components';
import TEFI_LOGO from '../public/tefi.svg';

interface Props {
  height?: string;
  width?: string;
}

const Container = styled<any>(Flex)`
  height: ${(props: any) => props.height || '65vh'};
  width: ${(props: any) => props.width || '80vw'};

  @media (max-width: 530px) {
    width: ${(props: any) => props.width === '80vw' ? '90vw': '100vw'};
  }

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${css({
    bg: 'background',
  })}
`;

const Text = styled.p`
  margin-top: 39px;
  color: ${(props) => props.theme.colors.secondary};
  font-weight: 500;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const StyledLogo = styled(TEFI_LOGO)`
  animation: ${rotate} 2s infinite;
  ${(props) =>
    css({
      transform: ['scale(0.6)', null, null, null, 'scale(0.7)'],
      '.tefi_svg__tirangleElement': {
        fill: props.theme.colors.secondary,
      },
      '.tefi_svg__lineElement': {
        stroke: props.theme.colors.secondary,
      },
      '.tefi_svg__circleElement': {
        fill: props.theme.colors.secondary,
        opacity: props.theme.opacity.logo,
      },
    })}
`;

const Loading: React.FC<Props> = ({ height = '65vh', width = '80vw' }) => {
  return (
    <Container height={height} width={width}>
      <StyledLogo />
      <Text>searching the cosmos...</Text>
    </Container>
  );
};

export default Loading;
