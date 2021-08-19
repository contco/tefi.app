import React, {useState} from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box, Modal, Text } from '@contco/core-ui';
import { ClaimButton } from '../dashboardStyles';



const InputContainer = styled(Flex)`
  ${css({
      justifyContent: 'space-around',
      alignItems: 'center',
      mt: 5
  })}
`;

const PriceInput = styled.input`
  ${css({
      width:150,
      height: 30,
  })}
`;

const ButtonContainer = styled(Flex)`
  ${css({
      justifyContent:'center',
      mt: 6,
  })}
`;

interface Props {
    showAlertModal: boolean;
    setAlertModalVisible: any;
    symbol: string;
  }
  

export const AlertSelect: React.FC<Props> = ({symbol, showAlertModal, setAlertModalVisible}) => {

   const [priceInput, setPriceInput] = useState<string | null>(null);

   const onSubmitClick = () => {
    setAlertModalVisible(false);
    }

    return (
        <Modal onClose={() => setAlertModalVisible(false)} isOpen={showAlertModal}>
            <Box p={4} bg='background' height={240} width={300}>
            <Text color='secondary' fontWeight='bold' textAlign='center'>{symbol} Alert</Text>
            <InputContainer>
                <Text color='secondary' fontWeight='bold'>Price</Text>
                <PriceInput type='number' onChange={e => setPriceInput(e.target.value)} />
             </InputContainer>
             <ButtonContainer>
                <ClaimButton onClick={onSubmitClick} width={120}>Set Alert</ClaimButton>
             </ButtonContainer>
            </Box> 
        </Modal>
    )
};
