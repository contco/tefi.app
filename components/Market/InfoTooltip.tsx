import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Text } from '@contco/core-ui';
import { InfoIcon } from '../Icons';

const Container = styled(Flex)`
  position: relative;
  alignitems: center;
`;

const StyledInfoIcon = styled(InfoIcon)`
  transform: scale(0.6);
  cursor: help;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.7;
  }
`;

const Tooltip = styled(Flex)`
  ${css({
    position: 'absolute',
    width: 300,
    height: 40,
    bg: 'lightBackground',
    color: '#0221ba',
    top: '-44px',
    left: -140,
    opacity: '0',
    fontSize: 1,
    justifyContent: 'center',
    alignItems: 'center',
    visibility: 'hidden',
    transition: 'opacity 0.5s ease-out',
  })}

  &::before {
    position: absolute;
    border-right: 6px solid transparent;
    border-top: 6px solid #eaeeff;
    border-left: 6px solid transparent;
    content: '';
    height: 0;
    top: 40px;
    left: 145px;
    width: 0;
  }

  ${Container}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

const InfoTooltip = () => {
  return (
    <Container>
      <StyledInfoIcon />
      <Tooltip>
        <Text>Enable notifications for price alerts</Text>
      </Tooltip>
    </Container>
  );
};

export default InfoTooltip;
