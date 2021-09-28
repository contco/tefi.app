import React, {useState, useEffect, useRef} from 'react';
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
import { useAssetsDataContext } from '../../contexts';
import {fetchAccountsData} from '../../utils/useAccounts';


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

interface SendModalTipProps extends ModalDisplayState, SendModalTipState {}

const SendModal: React.FC<SendModalTipProps> = ({isVisible, setVisible, isTip, setIsTip, tipAddress}) => {
  const [modalState, setModalState] = useState(ModalState.initial);
  const [txHash, setTxHash] = useState('');
  const [isPollingTx, setIsPollingTx] = useState(false);

  const {updateAccountData} = useAssetsDataContext();


  const {useConnectedWallet, post } = useWallet();
  const connectedWallet = useConnectedWallet();
  const walletConnectedRef = useRef(false);

  const onClose = () => {
    if(walletConnectedRef.current) {
      setModalState(ModalState.initial);
    }
    else {
      setModalState(ModalState.disconnected);
    }
    setIsTip(false);
    setVisible(false);
  }

  const updateAssetsData = async () => {
    try {
      const result = await fetchAccountsData(connectedWallet?.terraAddress);
      const [anchor, mirror, loterra, pylon, spectrum, starterra, core, apollo] = result;
      const updatedData = {assets: {...core,mirror, anchor, loterra, spectrum, starterra, pylon, apollo}};
      updateAccountData(updatedData);
    }
    catch(err) {
      console.warn('error updating account data', err);
    }
  }

  useEffect(() => {
    if(connectedWallet?.terraAddress) {
      setModalState(ModalState.initial);
      walletConnectedRef.current = true;
    }
    else {
      setModalState(ModalState.disconnected);
      walletConnectedRef.current = false;
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
         updateAssetsData();
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
      const {error, msg, txResult}: any = await sendToken(data, post);
      if(txResult?.success) {
        setModalState(ModalState.broadcasted);
        setTxHash(txResult?.result?.txhash);
        setIsPollingTx(true); 
        
      }
      if(error) {
         if(msg === "User Denied") {
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
    else return <InputModal isTip={isTip} tipAddress={tipAddress} onSend={onSend}/>;
  }


  return(
    <StyledModal isOpen={isVisible} onClose={onClose}>
      {showModalState()}
    </StyledModal> 
  );
}

export default SendModal;