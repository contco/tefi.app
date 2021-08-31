import React, {useState} from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Modal } from '@contco/core-ui';
import { InputModal } from './InputModal';
import {WaitingModal} from './WaitingModal';

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

const SendModal: React.FC<Props> = ({showModal, setModalVisible}) => {
  const [modalState, setModalState] = useState(ModalState.waiting);

  return(
    <StyledModal isOpen={showModal} onClose={() => setModalVisible(false)}>
      { modalState === ModalState.initial  ?
        <InputModal /> : <WaitingModal />
      }
    </StyledModal> 
  );
}

export default SendModal;