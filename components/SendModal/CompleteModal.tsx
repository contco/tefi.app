import React from 'react';
import { CheckCircleIcon, DeniedIcon } from '../Icons';
import { TxHash } from './TxHash';
import { ModalButton } from './ModalButton';
import {ModalSmall ,ContentContainer, IconContainer, Title } from './common';

const COMPLETE_TEXT = 'Complete!';
const DENIED_TEXT = 'User Denied';

export enum Status {
    complete,
    denied
}

interface Props {
    status: Status,
    txHash?: string,
    onClose: () => void;
}

export const CompleteModal: React.FC<Props> = ({status, txHash, onClose}) => {

  if (status === Status.complete) {
    return (
      <ModalSmall>
        <ContentContainer>
          <IconContainer>
            <CheckCircleIcon />
          </IconContainer>
          <Title>{COMPLETE_TEXT}</Title>
        </ContentContainer>
        <TxHash isSmallSize txHash={txHash} /> 
        <ModalButton isSmallSize onClick={onClose}  title='OK' />
      </ModalSmall>
    );
  }

  else {
    return (
      <ModalSmall>
        <ContentContainer>
          <IconContainer>
            <DeniedIcon />
          </IconContainer>
          <Title>{DENIED_TEXT}</Title>
        </ContentContainer>
        <ModalButton onClick={onClose} title='OK' />
      </ModalSmall>
    );
  }
}