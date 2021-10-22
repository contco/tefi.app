import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex } from '@contco/core-ui';
import { SmallText } from './common';

const Container = styled(Flex)`
  ${(props) =>
    css({
      height: props.isSmallSize ? [20] : [80, null, null, 160],
      justifyContent: 'space-between',
      alignItems: 'center',
    })}
`;

const StyledSmallText = styled(SmallText)`
  ${css({
    cursor: 'pointer',
    textDecoration: 'underline',
  })}
`;

interface Props {
  txHash: string;
  className?: string;
  isSmallSize?: boolean;
}

const TX_URL = 'https://finder.terra.money/columbus-4/tx/';

export const TxHash: React.FC<Props> = ({ txHash, className, isSmallSize }) => {
  const txHashDisplayText = txHash.substr(0, 5) + '......' + txHash.substr(txHash.length - 3, txHash.length - 1);
  const onTxClick = () => {
    window.open(TX_URL + txHash, '_blank');
  };
  return (
    <Container isSmallSize={isSmallSize} className={className}>
      <SmallText>TxHash</SmallText>
      <StyledSmallText onClick={onTxClick}>{txHashDisplayText}</StyledSmallText>
    </Container>
  );
};
