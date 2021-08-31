import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Flex, Text, } from '@contco/core-ui';
import { ButtonRound } from '../UIComponents';
import { HourGlassIcon } from '../Icons';

export const ModalBox = styled(Box)`
  ${css({
    height: [260, null, null, 400],
    width: ['80vw', null, null, null, 680],
    maxHeight: 400,
    boxSizing: 'borderBox',
    px: 4,
  })}
`;

const ContentContainer = styled(Flex)`
  ${css({
      height: [160, null, null, 240],
      flexDirection: 'column',
      justifyContent:'flex-end',
      py: [3, null, null, 4],
  })}
`;

const IconContainer = styled(Flex)`
 ${css({
   mb: [0, null, null, 2],
   minHeight: 90,
   justifyContent: 'center',
   alignItems:'center',
 })}
`;

const WaitingIcon = styled(HourGlassIcon)`
  ${css({
      transform: ['scale(1.8)', null, null, 'scale(3)'],
      color: 'secondary',
  })}
`;

export const Title = styled(Text)`
  ${css({
    color: 'secondary',
    textAlign: 'center',
    width: '100%',
    fontSize: [2, null, null, 5],
    fontWeight: 500,
    letterSpacing: 1.5
  })}
`;

const BottomContainer = styled(Flex)`
 ${css({
   height: [80, null, null, 160],
   justifyContent: 'space-between',
   alignItems: 'center',
 })}
`;

const SmallText = styled(Text)`
${css({
  color: 'secondary',
  fontSize: ['8px', null, null, 0],
  letterSpacing: 1,
  lineHeight: ['10px', null, null, '15px'],
})}
`;

export const BroadcastModal = () => {
  return (
    <ModalBox>
     <ContentContainer>
        <IconContainer>
            <WaitingIcon />
        </IconContainer>
        <Title>Waiting For Receipt...</Title>
        <Box mt={[2, null, null, 3]}>
        <SmallText textAlign='center'>Transaction broadcasted. There is no need to send another unitl it has been complete.</SmallText>
        </Box>
      </ContentContainer>
      <BottomContainer>
        <SmallText>TxHash</SmallText>
        <SmallText>97890.....90</SmallText>
      </BottomContainer>
  </ModalBox>
  );
}