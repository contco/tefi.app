import React, {useState} from 'react';
import {useRouter} from 'next/router';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box, Modal, Text } from '@contco/core-ui';
import { ClaimButton } from '../dashboardStyles';
import { useAlertContext } from '../../providers/AlertProvider';
import { useEffect } from 'react';


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
		currentPrice: string;
		isActive: boolean;
  }
  

export const AlertSelect: React.FC<Props> = ({currentPrice, showAlertModal, setAlertModalVisible, isActive}) => {

   const [priceInput, setPriceInput] = useState<string | null>('0');
   const { alerts, setPriceAlert, cancelAlert} = useAlertContext();
   const router = useRouter();
	 const tokenSymbol = router?.query.symbol as string;


	 useEffect(() => {
      if(showAlertModal && alerts[tokenSymbol]) {
				setPriceInput(alerts[tokenSymbol]?.price);
			}
	 }, [showAlertModal]);

   const onSubmitClick = () => {
    setAlertModalVisible(false);
    if(priceInput && priceInput !== '')  {
        setPriceAlert(tokenSymbol, priceInput, currentPrice);
				setPriceInput('0');
    }
   }

	 const onCancel = () => {
		 setAlertModalVisible(false);
		 cancelAlert(tokenSymbol);
		 setPriceInput('0');
	 }

	 const onClose = () => {
		 setPriceInput('0');
		 setAlertModalVisible(false)
	 }

    return (
      <Modal onClose={onClose} isOpen={showAlertModal}>
        <Box p={4} bg='background' height={240} width={300}>
          <Text color='secondary' fontWeight='bold' textAlign='center'>{tokenSymbol?.toUpperCase()} Alert</Text>
          <InputContainer>
              <Text color='secondary' fontWeight='bold'>Price</Text>
              <PriceInput type='number' value={priceInput} onChange={e => setPriceInput(e.target.value)} />
            </InputContainer>
            <ButtonContainer>
						  {isActive ? <ClaimButton onClick={onCancel} width={80}>Cancel</ClaimButton> : null}
              <ClaimButton onClick={onSubmitClick} width={100}>Set Alert</ClaimButton>
            </ButtonContainer>
        </Box> 
      </Modal>
    )
};
