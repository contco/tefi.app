import React from 'react';
import { Box } from '@contco/core-ui';
import { HourGlassIcon } from '../Icons';
import { TxHash } from './TxHash';
import { ModalSmall, ContentContainer, IconContainer, Title, SmallText } from './common';

const TITLE_TEXT = 'Waiting For Receipt...';
const MESSAGE_TEXT = 'Transaction broadcasted. There is no need to send another unitl it has been complete.';

export const BroadcastModal = () => {
  return (
    <ModalSmall>
     <ContentContainer>
        <IconContainer>
            <HourGlassIcon />
        </IconContainer>
        <Title>{TITLE_TEXT}</Title>
        <Box mt={[2, null, null, 3]}>
            <SmallText textAlign='center'>{MESSAGE_TEXT}</SmallText>
        </Box>
      </ContentContainer>
      <TxHash txHash={'234....4343'}/>
  </ModalSmall>
  );
}