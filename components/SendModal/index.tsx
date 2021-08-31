import React, {useState} from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Modal } from '@contco/core-ui';
import { InputModal } from './InputModal';

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
  submission,
  broadcasted,
  sucess,
  denied
}

const SendModal: React.FC<Props> = ({showModal, setModalVisible}) => {
  const [modalState, setModalState] = useState(ModalState.initial);

  return(
    <StyledModal isOpen={showModal} onClose={() => setModalVisible(false)}>
      { modalState === ModalState.initial  ?
        <InputModal /> : null
      }
    </StyledModal> 
  );
}

export default SendModal;