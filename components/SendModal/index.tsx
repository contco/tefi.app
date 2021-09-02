import React, {useState} from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Modal } from '@contco/core-ui';
import { InputModal } from './InputModal';
import {WaitingModal} from './WaitingModal';
import { BroadcastModal } from './BroadcastModal';
import { CompleteModal, Status } from './CompleteModal';
const StyledModal = styled(Modal)`
  ${css({
    bg: 'background',
    borderRadius: 10,
  })}
`;
interface Props {
  showModal: boolean;
  setModalVisible: (state : boolean) => void;
}

enum ModalState {
  initial,
  waiting,
  broadcasted,
  success,
  denied
}

interface SendInput {
  address: string;
  amount: string;
  memo: string;
}

const SendModal: React.FC<Props> = ({showModal, setModalVisible}) => {
  const [modalState, setModalState] = useState(ModalState.initial);
  const [input, setInput] = useState<SendInput>({address: '', amount: '', memo: ''});

  const onClose = () => {
    setModalVisible(false);
  }

  const onSend = () => {
    console.log('send tokens');
  }

  return(
    <StyledModal isOpen={showModal} onClose={() => setModalVisible(false)}>
      { modalState === ModalState.initial  ?
        <InputModal onSend={onSend} input={input} setInput={setInput}/> : <WaitingModal onClose={onClose} />
      }
    </StyledModal> 
  );
}

export default SendModal;