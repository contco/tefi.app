import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Flex, Text, } from '@contco/core-ui';
import { CurrencySelect } from './CurrencySelect';
import { ButtonRound } from '../UIComponents';

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

const Input = styled.input`
  ${css({
    height: [28, null, 38, 48],
    width: ['calc(80vw - 40px)', null, null, 480],
    outline: 0,
    border: 0,
    bg: 'postBg',
    color: 'secondary',
    fontSize: [1,null, null, null, 2],
    letterSpacing: 1,
    px: 2,
    '&::placeholder': {
      color: 'secondary',
      fontSize: [1,null, null, null, 2],
      letterSpacing: 1
    }
  })}
`; 

const AddressInput = styled(Input)`
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


export const InputModal = () => {
  return (
    <ModalBox>
      <ModalTitle>Send</ModalTitle>
      <InputSection>
        <InputContainer>
          <InputLabel>Send To</InputLabel>
          <Input type='text' placeholder="Address" />
        </InputContainer>
        <InputContainer>
          <InputLabel>Amount</InputLabel>
          <Flex>
            <CurrencySelect />
            <AddressInput type='number' />
          </Flex>
        </InputContainer>
        <InputContainer>
          <InputLabel>Memo (Optional)</InputLabel>
          <Input type='text' placeholder="MEMO" />
        </InputContainer>
      </InputSection>
      <FeeSection>
        <FeeText fontWeight={500}>TxFee</FeeText>
        <FeeText>23.45</FeeText>
      </FeeSection>
      <ButtonContainer>
        <ButtonRound>Send</ButtonRound>
      </ButtonContainer>
  </ModalBox>
  );
}