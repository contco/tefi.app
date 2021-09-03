import React, {useState} from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Modal } from '@contco/core-ui';
import { InputModal } from './InputModal';
import {WaitingModal} from './WaitingModal';
import { BroadcastModal } from './BroadcastModal';
import { CompleteModal, Status } from './CompleteModal';
import { sendNativeToken } from '../../transactions/sendToken';
import useWallet from '../../lib/useWallet';

const StyledModal = styled(Modal)`
  ${css({
    bg: 'background',
    borderRadius: 10,
  })}
`;

enum ModalState {
  initial,
  waiting,
  broadcasted,
  success,
  denied
}


const SendModal: React.FC<ModalDisplayState> = ({isVisible, setVisible}) => {
  const [modalState, setModalState] = useState(ModalState.initial);
  const [txHash, setTxHash] = useState('332...2332');

  const onClose = () => {
    setModalState(ModalState.initial);
    setVisible(false);
  }

  const {post } = useWallet();


  const onSend = async (data: any) => {
    setModalState(ModalState.waiting);
    if(data.denom) {
      const result = await sendNativeToken(data, post);
      if(result.success) {
        setModalState(ModalState.broadcasted);
        setTxHash(result?.result?.txhash);
      }
      if(result.error) {
         if(result.msg === "User Denied") {
           setModalState(ModalState.denied);
         }
         else {
           setModalState(ModalState.initial);
           alert('Error Sending Transaction');
         }

      }
    }
  }

  const showModalState = () => {
    if(modalState === ModalState.waiting) {
      return <WaitingModal onClose={onClose} />
    }
    else if (modalState === ModalState.broadcasted) {
      return <BroadcastModal txHash={txHash} />
    }
    else if (modalState === ModalState.success || modalState === ModalState.denied) {
      return <CompleteModal onClose={onClose} txHash={txHash} status={modalState === ModalState.success ? Status.complete : Status.denied} />
    }
    else return <InputModal onSend={onSend}/>;
  }


  return(
    <StyledModal isOpen={isVisible} onClose={() => setVisible(false)}>
      {showModalState()}
    </StyledModal> 
  );
}

export default SendModal;