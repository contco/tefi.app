import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Modal } from '@contco/core-ui';
import { InputModal } from './InputModal';
import {WaitingModal} from './WaitingModal';
import { BroadcastModal } from './BroadcastModal';
import { CompleteModal } from './CompleteModal';
import { DisconnectedModal } from './DisconnectedModal';
import { sendToken } from '../../transactions/sendToken';
import useWallet from '../../lib/useWallet';
import { useInterval } from '../../utils/useInterval';
import { FCD_URL } from '../../pages/api/utils';
import axios from 'axios';

const POLLING_INTERVAL = 1000;

const StyledModal = styled(Modal)`
  ${css({
    bg: 'background',
    borderRadius: 10,
  })}
`;

export enum ModalState {
  disconnected,
  initial,
  waiting,
  broadcasted,
  success,
  denied,
  error,
}


const SendModal: React.FC<ModalDisplayState> = ({isVisible, setVisible}) => {
  const [modalState, setModalState] = useState(ModalState.initial);
  const [txHash, setTxHash] = useState('');
  const [isPollingTx, setIsPollingTx] = useState(false);

  const onClose = () => {
    setModalState(ModalState.initial);
    setVisible(false);
  }

  const {useConnectedWallet, post } = useWallet();
  const connectedWallet = useConnectedWallet();


  useEffect(() => {
    if(connectedWallet?.terraAddress) {
      setModalState(ModalState.initial);
    }
    else {
      setModalState(ModalState.disconnected);
    }
  }, [connectedWallet?.terraAddress]);

  const fetchTxInfo = async () => { 
    try {
     const {data} = await axios.get(FCD_URL + `tx/${txHash}`);
     if(data?.height ) {
       setIsPollingTx(false);
       if(data?.code) {
         setModalState(ModalState.error);
       }
       else {
         setModalState(ModalState.success);
       }
     }
     
    }
    catch(err) {
      console.warn('error', err);
    }
  }

  useInterval(fetchTxInfo, isPollingTx ? POLLING_INTERVAL : null);


  const onSend = async (data: any) => {
    setModalState(ModalState.waiting);
      const result = await sendToken(data, post);
      if(result.success) {
        setModalState(ModalState.broadcasted);
        setTxHash(result?.result?.txhash);
        setIsPollingTx(true);
        
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

  const showModalState = () => {
    if(modalState === ModalState.disconnected) {
      return <DisconnectedModal onClose={onClose} />
    }
    else if(modalState === ModalState.waiting) {
      return <WaitingModal onClose={onClose} />
    }
    else if (modalState === ModalState.broadcasted) {
      return <BroadcastModal txHash={txHash} />
    }
    else if (modalState === ModalState.success || modalState === ModalState.denied || modalState === ModalState.error) {
      return <CompleteModal onClose={onClose} txHash={txHash} status={modalState} />
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