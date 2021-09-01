import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex } from '@contco/core-ui';
import { SmallText } from './common';

const Container = styled(Flex)`
 ${props => css({
   height: props.isSmallSize ? [20] : [80, null, null, 160],
   justifyContent: 'space-between',
   alignItems: 'center',
 })}
`;

interface Props {
    txHash: string;
    className?: string;
    isSmallSize?: boolean;
}

export const TxHash: React.FC<Props> = ({txHash, className, isSmallSize}) => {
  return (
      <Container isSmallSize={isSmallSize} className={className}>
        <SmallText>TxHash</SmallText>
        <SmallText>{txHash}</SmallText>
      </Container>
  );
}