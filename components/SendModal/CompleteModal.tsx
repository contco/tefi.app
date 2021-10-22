import React from 'react';
import { CheckCircleIcon, DeniedIcon, ErrorIcon } from '../Icons';
import { TxHash } from './TxHash';
import { ModalButton } from './ModalButton';
import { ModalSmall, ContentContainer, IconContainer, Title } from './common';
import { ModalState } from '.';

const COMPLETE_TEXT = 'Complete!';
const DENIED_TEXT = 'User Denied';
const ERROR_TEXT = 'Failed!';

interface Props {
  status: ModalState;
  txHash?: string;
  onClose: () => void;
}

export const CompleteModal: React.FC<Props> = ({ status, txHash, onClose }) => {
  if (status === ModalState.denied) {
    return (
      <ModalSmall>
        <ContentContainer>
          <IconContainer>
            <DeniedIcon />
          </IconContainer>
          <Title>{DENIED_TEXT}</Title>
        </ContentContainer>
        <ModalButton onClick={onClose} title="OK" />
      </ModalSmall>
    );
  }

  return (
    <ModalSmall>
      <ContentContainer>
        <IconContainer>{status === ModalState.success ? <CheckCircleIcon /> : <ErrorIcon />}</IconContainer>
        <Title>{status === ModalState.success ? COMPLETE_TEXT : ERROR_TEXT}</Title>
      </ContentContainer>
      <TxHash isSmallSize txHash={txHash} />
      <ModalButton isSmallSize onClick={onClose} title="OK" />
    </ModalSmall>
  );
};
