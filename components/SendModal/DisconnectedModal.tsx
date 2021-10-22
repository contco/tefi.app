import React from 'react';
import { DisconnectIcon } from '../Icons';
import { ModalButton } from './ModalButton';
import { ModalSmall, ContentContainer, IconContainer, Title } from './common';

const DENIED_TEXT = 'Please connect wallet!';

export enum Status {
  complete,
  denied,
}

interface Props {
  onClose: () => void;
}

export const DisconnectedModal: React.FC<Props> = ({ onClose }) => {
  return (
    <ModalSmall>
      <ContentContainer>
        <IconContainer>
          <DisconnectIcon />
        </IconContainer>
        <Title>{DENIED_TEXT}</Title>
      </ContentContainer>
      <ModalButton onClick={onClose} title="OK" />
    </ModalSmall>
  );
};
