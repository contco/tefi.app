import React, { ReactNode, createContext, useState } from 'react';
import SendModal from '../../components/SendModal';

interface ContextProps{
    sendModal: ModalDisplayState;
}

interface Props {
  children: ReactNode;
}

const ModalContext = createContext<ContextProps>({
  sendModal: null,
});

const ModalProvider: React.FC<Props> = ({ children }) => {

  const [sendModalVisible, setSendModalVisible] = useState<boolean>(false);
 
  const sendModal = {isVisible: sendModalVisible, setVisible: setSendModalVisible};

  return (
    <ModalContext.Provider value={{sendModal}}>
      {children}
      <SendModal {...sendModal} />
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