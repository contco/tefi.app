import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Flex, Text, } from '@contco/core-ui';
import { CurrencySelect } from './CurrencySelect';
import { ButtonRound } from '../UIComponents';
import { AccAddress } from '@terra-money/terra.js';


export const ModalBox = styled(Box)`
  ${css({
    height: [530, null, 550, 600],
    width: ['80vw', null, null, null, 680],
    maxHeight: 600
  })}
`;

export const ModalTitle = styled(Text)`
  ${css({
    color: 'secondary',
    pt: [4, null, null, 5],
    pb: [2, null, null, 0],
    textAlign: 'center',
    width: '100%',
    fontSize: [3, null, 5],
    fontWeight: 500,
    letterSpacing: 1.5
  })}
`;
const InputSection = styled(Flex)`
  ${css({
    flexDirection: 'column',
    alignItems: 'center',
    mt: 8,
  })}
`;

const InputContainer = styled(Box)`
  ${css({
    mb: 4,
  })}
`;

const InputLabel = styled(Text)`
  ${css({
    color: 'secondary',
    fontSize: [1,null, null, null, 2],
    letterSpacing: 1,
    fontWeight: 500,
    mb: 2,
  })}
`;

interface InputProps {
  error?: boolean;
}

const Input = styled.input<InputProps>`
:-webkit-autofill,
:-webkit-autofill:hover, 
:-webkit-autofill:focus,
select:-webkit-autofill,
select:-webkit-autofill:hover,
select:-webkit-autofill:focus {
  -webkit-text-fill-color: ${props => props.theme.colors.secondary};
  -webkit-box-shadow: 0 0 0px 0px ${props => props.theme.colors.postBg} inset;
  transition: background-color 5000s ease-in-out 0s;
}
  ${props => css({
    height: [28, null, 38, 48],
    width: ['calc(80vw - 40px)', null, null, 480],
    border: 0,
    bg: 'postBg',
    color: 'secondary',
    fontSize: [1,null, null, null, 2],
    px: 3,
    letterSpacing: 1,
    outline: props.error ? '1px solid #e74c3c' : 0,
    '&::placeholder': {
      color: 'secondary',
      fontSize: [1,null, null, null, 2],
      letterSpacing: 1
    }
  })}
`; 

const AmountBox = styled(Flex)`
  ${props => css({
    outline: props.error ? '1px solid #e74c3c' : 0,
  })}
`;
const AmountInput = styled(Input)`
  width: 380px;
  ${css({
    width: ['calc(80vw - 140px)', null, null, 380]
  })}
`;

const FeeSection = styled(Flex)`
  ${css({
    width: ['calc(80vw - 40px)', null, null, 480],
    mx:'auto',
    justifyContent: 'space-between',
    mb: 4,
  })}
`;

const FeeText = styled(Text)`
${css({
  color: 'secondary',
  fontSize: 0,
  letterSpacing: 1,
})}
`;

const ButtonContainer = styled(Box)`
 ${css({
   mx: 'auto', 
   my: 4,
   width: 'max-content',
 })}
`;

export const InputModal = ({input, setInput, onSend}) => {

 
  const onChange = (e: any) => {
    let value =  e.target.value;
    const key = e.target.name;
    if(key === 'amount' ) {
        value =  value === ''  ? value :  `${Math.abs(value)}`;
      }

    setInput({...input, [key]: value});
  }

  const isValidAddress = AccAddress.validate(input.address);
 
  const isSendDisabled = !isValidAddress || input.address.trim() === '' || input.amount.trim() === '';
  
  const onSendClick = () => {
    if(!isSendDisabled) {
      onSend();
    }
  }
  return (
    <ModalBox>
      <ModalTitle>Send</ModalTitle>
      <InputSection>
        <InputContainer>
          <InputLabel>Send To</InputLabel>
          <Input error={input.address !== '' && !isValidAddress} onChange={onChange} name='address' type='text' placeholder="Address" />
        </InputContainer>
        <InputContainer>
          <InputLabel>Amount</InputLabel>
          <AmountBox>
            <CurrencySelect />
            <AmountInput value={input.amount} onChange={onChange} name='amount' min= '0' type='number' />
          </AmountBox>
        </InputContainer>
        <InputContainer>
          <InputLabel>Memo (Optional)</InputLabel>
          <Input onChange={onChange} name='memo' type='text' placeholder="MEMO" />
        </InputContainer>
      </InputSection>
      <FeeSection>
        <FeeText fontWeight={500}>TxFee</FeeText>
        <FeeText>23.45</FeeText>
      </FeeSection>
      <ButtonContainer>
        <ButtonRound onClick={onSendClick} disabled={isSendDisabled}>Send</ButtonRound>
      </ButtonContainer>
  </ModalBox>
  );
}