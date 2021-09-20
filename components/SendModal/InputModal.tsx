import React, {useState, useMemo} from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Flex, Text, } from '@contco/core-ui';
import { CurrencySelect } from './CurrencySelect';
import { ButtonRound } from '../UIComponents';
import { AccAddress } from '@terra-money/terra.js';
import { useAssetsDataContext } from '../../contexts';
import { SmallText } from './common';
import { useEffect } from 'react';
import { simulateSendTokenTx } from '../../transactions/sendToken';
import useWallet from '../../lib/useWallet';

const DEFAULT_INPUT_STATE = {address: '', amount: '', memo: ''};
const DEFAULT_TX_STATE = '---';
const AMOUNT_ERROR = 'Amount should be less than balance';
const TAX_ERROR = 'Balance not enough to pay fee';
const AMOUNT_DECIMAL_ERROR = 'Amount must be within 6 decimal points';
const UST_DENOM = 'uusd';

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

const BalanceContainer = styled(Flex)`
  ${css({
    justifyContent: 'space-between',
    pt: 1,
  })}
`;

const MsgText = styled(SmallText)`
  ${css({
    color: '#e74c3c', 
    pr: 2,
    width: '70%',
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

const ButtonContainer = styled(Box)`
 ${css({
   mx: 'auto', 
   my: 4,
   width: 'max-content',
 })}
`;

interface SendInput {
  address: string;
  amount: string;
  memo: string;
}

export const InputModal = ({onSend}) => {
  const {data, loading} = useAssetsDataContext();
  const [input, setInput] = useState<SendInput>(DEFAULT_INPUT_STATE);
  const [selectedAsset, setAsset] = useState<Holdings | null>(null);
  const [txFee, setTxFee] = useState<string>(DEFAULT_TX_STATE);
  const [isTxCalculated, setIsTxCalculated] = useState(false);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const {useConnectedWallet} = useWallet();

  const assets  = data ? [...data?.assets?.core?.coins, ...data?.assets?.anchor?.assets,  ...data?.assets?.mirror?.mirrorHoldings, ...data?.assets?.pylon?.pylonHoldings, ...data?.assets?.spectrum?.specHoldings] : [];
  const ustAsset: any = assets.filter((asset: Holdings) => asset.denom === UST_DENOM);

  const connectedWallet = useConnectedWallet();
  const walletAddress = connectedWallet?.terraAddress;

  useEffect(() => {
    if(!selectedAsset  && assets.length > 0) {
      setAsset(assets[0]);
    }
  }, [assets])
  
  const resetTxState = () =>{
    if(isTxCalculated) {
      setIsTxCalculated(false);
      setTxFee(DEFAULT_TX_STATE)
    }
  }

  const onChange = (e: any) => {
    let value =  e.target.value;
    const key = e.target.name;
    if(key === 'amount' ) {
       if(value !== '' && Math.sign(value) === -1) {
         value = (value * -1).toString();
       }
    }
    setInput({...input, [key]: value});
    resetTxState();
  }

  const isValidAddress = AccAddress.validate(input.address);

  const amountError = useMemo(() => {
    if (input.amount !== '') {
      if(!isTxCalculated) {
        const lengthError = input.amount.split('.')[1] ? !(input.amount.split('.')[1]?.length <= 6) : false;
        if (lengthError) {  
        return {error: true, msg: AMOUNT_DECIMAL_ERROR};
        }
        if(+input.amount >= +selectedAsset?.balance) {
          return{error: true, msg: AMOUNT_ERROR};
        }
      }
      else if (isTxCalculated && !simulationLoading) {
        if(selectedAsset?.denom) {
          if ((parseFloat(txFee)) > parseFloat(ustAsset?.balance) ) {
            return {error: true, msg: TAX_ERROR};
          }
        }
        
      }
    }
    return {error: false, msg: ''};
  }, [input.amount, txFee, isTxCalculated, simulationLoading, selectedAsset?.balance])
 
  const isInvalidInput =  amountError.error || !isValidAddress || input.address.trim() === '' || input.amount.trim() === '';
  const isSendDisabled =  amountError.error || simulationLoading || !isTxCalculated;
  const onAssetSelect = (asset: Holdings ) => {
    setAsset(asset);
    resetTxState();
  }
  
  const getDisabledState = () => {
    if(simulationLoading)  {
      return true;
    }
   else if(!isTxCalculated ) {
      if(isInvalidInput) {
        return true;
      }
      return false;
    }
    else if (isSendDisabled) {
      return true;
    }
    return false;
  }
   
  const onSendClick = async () => {
    if(!getDisabledState()) {
      if(!isTxCalculated) {
        setSimulationLoading(true);
        const data = {to: input.address, from: walletAddress, amount: input.amount, memo: input.memo, denom: selectedAsset?.denom, txDenom: UST_DENOM , contract: selectedAsset?.contract };
        const result = await simulateSendTokenTx(data);
        if(!result.error) { 
          setTxFee(result.fee);
          setIsTxCalculated(true);
        }
        setSimulationLoading(false);
      }
      else {
        const data = {to: input.address, from: walletAddress, amount: input.amount, memo: input.memo, denom: selectedAsset?.denom, txDenom: UST_DENOM, contract: selectedAsset?.contract };
        resetTxState();
        setInput(DEFAULT_INPUT_STATE);
        onSend(data);
      }
    }
  }

  const showTxSymbol = () => {
    if(!isTxCalculated) {
      return '';
    }
    else {
      return 'UST';
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
          <AmountBox error={amountError.error}>
            <CurrencySelect loading={loading} assets={assets} selectedAsset={selectedAsset} setAsset={onAssetSelect}/>
            <AmountInput value={input.amount} onChange={onChange} name='amount' min= '0' type='number' />
          </AmountBox>
          <BalanceContainer>
            <MsgText>{amountError.msg}</MsgText>
            <SmallText>Balance: {selectedAsset  ? selectedAsset?.balance : '0.00'}</SmallText>
          </BalanceContainer>
        </InputContainer>
        <InputContainer>
          <InputLabel>Memo (Optional)</InputLabel>
          <Input onChange={onChange} name='memo' type='text' placeholder="MEMO" />
        </InputContainer>
      </InputSection>
      <FeeSection>
        <SmallText fontWeight={500}>TxFee</SmallText>
        <SmallText>{simulationLoading ? 'Simulating...' : `${txFee} ${showTxSymbol()}`}</SmallText>
      </FeeSection>
      <ButtonContainer>
        <ButtonRound onClick={onSendClick} disabled={getDisabledState()}>{isTxCalculated ? 'Send' : 'Next'}</ButtonRound>
      </ButtonContainer>
  </ModalBox>
  );
}