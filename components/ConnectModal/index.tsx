import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { isMobile } from 'react-device-detect';
import { Flex, Box, Text, Modal } from '@contco/core-ui';
import { WalletConnectType } from '../../constants';
import useWallet from '../../lib/useWallet';


export const ModalBox = styled(Box)`
  ${css({
    bg: 'background',
    height: [200, null, null, 280],
    width: [300, null, null, 600],
  })}
`;

export const ModalTitle = styled(Text)`
  ${css({
    color: 'secondary',
    pt: [4, null, null, 5],
    pb: [2, null, null, 0],
    textAlign: 'center',
    width: '100%',
    fontWeight: 'bold',
    fontSize: [1, null, 3],
  })}
`;

export const ModalSection = styled(Flex)`
  ${css({
    height: [40, null, null, 60],
    px: [3, null, null, 5],
    bg: 'secondary',
    fontWeight: 'bold',
    opacity: 5,
    color: 'background',
    fontSize: [0, null, null, 2],
    alignItems: 'center',
    my: [3, null, null, 4],
    mx: [3, null, null, 5],
    borderRadius: '15px',
    cursor: 'pointer',
    transition: 'opacity 0.3s',
    '&:hover': {
      opacity: 0.7,
    },
  })}
`;

interface Props {
  showModal: boolean;
  setModalVisible: (state : boolean) => void;
}

const ConnectModal: React.FC<Props> = ({showModal, setModalVisible}) => {

  const [mobile, setMobile] = useState<boolean>(false);

  useEffect(() => {
    setMobile(isMobile);
 }, [isMobile]);


  const { onConnect } = useWallet();

  const onTypeSelect = (type: WalletConnectType) => {
    onConnect(type);
    setModalVisible(false);
  };

  if (mobile) {
    return <> </>;  
  }

  return(
    <Modal isOpen={showModal} onClose={() => setModalVisible(false)}>
    <ModalBox>
      <ModalTitle>Connect To A Wallet</ModalTitle>
      <ModalSection onClick={() => onTypeSelect(WalletConnectType.Extension)}>
        Terra Wallet (Extension)
      </ModalSection>
      <ModalSection onClick={() => onTypeSelect(WalletConnectType.Mobile)}>Terra Wallet (Mobile)</ModalSection>
    </ModalBox>
  </Modal>
  );
}

export default ConnectModal;