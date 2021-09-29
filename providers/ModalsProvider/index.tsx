import React, { ReactNode, createContext, useState } from 'react';
import SendModal from '../../components/SendModal';

interface ContextProps{
    sendModal: ModalDisplayState;
    sendTip: (to: string) => void;
}

interface Props {
  children: ReactNode;
}


const ModalContext = createContext<ContextProps>({
  sendModal: null,
  sendTip: null,
});

const ModalProvider: React.FC<Props> = ({ children }) => {

  const [sendModalVisible, setSendModalVisible] = useState<boolean>(false);
  const [isTip, setIsTip] = useState<boolean>(false);
  const [tipAddress, setTipAddress] = useState<string>('');
 
  const sendModal = {isVisible: sendModalVisible, setVisible: setSendModalVisible};

  const sendTip = (tipAddress: string) => {
      setIsTip(true);
      setTipAddress(tipAddress);
      setSendModalVisible(true);
  }

  const sendModalTipProps = {isTip, setIsTip, tipAddress, setTipAddress};

  return (
    <ModalContext.Provider value={{sendModal, sendTip}}>
      {children}
      <SendModal {...sendModal} {...sendModalTipProps} />
    </ModalContext.Provider>
  );
};

export default ModalProvider;


export function useModalContext(): ContextProps {
    const context = React.useContext(ModalContext);
    if (context === undefined) {
      throw new Error('useModalContext must be used within ModalProvider');
    }
    return context;
  }