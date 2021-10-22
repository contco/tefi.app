import React from 'react';
import { HourGlassIcon } from '../Icons';
import { ModalButton } from './ModalButton';
import { ModalSmall, ContentContainer, IconContainer, Title } from './common';

const WAITING_TEXT = 'Waiting For Terra Station...';

interface Props {
  onClose: () => void;
}
export const WaitingModal: React.FC<Props> = ({ onClose }) => {
  return (
    <ModalSmall>
      <ContentContainer>
        <IconContainer>
          <HourGlassIcon />
        </IconContainer>
        <Title>{WAITING_TEXT}</Title>
      </ContentContainer>
      <ModalButton title="Close" onClick={onClose} />
    </ModalSmall>
  );
};
