import React, { ReactNode, createContext, useState } from 'react';
import SendModal from '../../components/SendModal';

interface ContextProps {
  sendModal: ModalDisplayState;
  sendTip: (to: string) => void;
  sendNFT: (data: any) => void;
}

interface Props {
  children: ReactNode;
}

const ModalContext = createContext<ContextProps>({
  sendModal: null,
  sendTip: null,
  sendNFT: null,
});

const ModalProvider: React.FC<Props> = ({ children }) => {
  const [sendModalVisible, setSendModalVisible] = useState<boolean>(false);
  const [isTip, setIsTip] = useState<boolean>(false);
  const [tipAddress, setTipAddress] = useState<string>('');
  const [NFTData, setNFTData] = useState<any>({});

  const sendModal = { isVisible: sendModalVisible, setVisible: setSendModalVisible };

  const sendTip = (tipAddress: string) => {
    setIsTip(true);
    setTipAddress(tipAddress);
    setSendModalVisible(true);
  };

  const sendNFT = (data) => {
    setNFTData(data);
    setSendModalVisible(true);
  };

  const sendModalProps = { isTip, setIsTip, tipAddress, setTipAddress, NFTData, setNFTData };

  return (
    <ModalContext.Provider value={{ sendModal, sendTip, sendNFT }}>
      {children}
      <SendModal {...sendModal} {...sendModalProps} />
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
