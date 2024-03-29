import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Flex, Text } from '@contco/core-ui';
import { CurrencySelect } from './CurrencySelect';
import { ButtonRound, Input, InputLabel, ModalLarge } from '../UIComponents';
import { AccAddress } from '@terra-money/terra.js';
import { useAccount } from '../../data/useAccount';
import { SmallText } from './common';
import { useEffect } from 'react';
import { simulateSendTokenTx } from '../../transactions/sendToken';
import useWallet from '../../lib/useWallet';
import { NFTItemContainer, NFTCollectionName, NFTItemName, NFTTextContainer } from '../NftComponent/Item';

const DEFAULT_INPUT_STATE = { address: '', amount: '', memo: '' };
const DEFAULT_TX_STATE = '---';
const AMOUNT_ERROR = 'Amount should be less than balance';
const TAX_ERROR = 'Balance not enough to pay fee';
const AMOUNT_DECIMAL_ERROR = 'Amount must be within 6 decimal points';
const UST_DENOM = 'uusd';
const TIP_MEMO = 'Tip via TefiApp';

export const ModalTitle = styled(Text)`
  ${css({
    color: 'secondary',
    pt: [4, null, null, 5],
    pb: [2, null, null, 0],
    textAlign: 'center',
    width: '100%',
    fontSize: [3, null, 5],
    fontWeight: 500,
    letterSpacing: 1.5,
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

const AmountBox = styled(Flex)`
  ${(props) =>
    css({
      outline: props.error ? '1px solid #e74c3c' : 0,
    })}
`;
const AmountInput = styled(Input)`
  width: 380px;
  ${css({
    width: ['calc(80vw - 140px)', null, null, 380],
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
    mx: 'auto',
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

const Image = styled.img`
  width: 199px;
  height: auto;
`;

const NFTInputSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
`;

interface SendInput {
  address: string;
  amount: string;
  memo: string;
}

export const InputModal = ({ onSend, isTip, tipAddress, NFTData }) => {
  const [input, setInput] = useState<SendInput>(DEFAULT_INPUT_STATE);
  const [selectedAsset, setAsset] = useState<Holdings | null>(null);
  const [assets, setAssets] = useState<Holdings[]>([]);
  const [txFee, setTxFee] = useState<string>(DEFAULT_TX_STATE);
  const [isTxCalculated, setIsTxCalculated] = useState(false);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const { useConnectedWallet } = useWallet();

  const ustAsset: any = useMemo(() => {
    const filteredAssets = assets.filter((asset: Holdings) => asset.denom === UST_DENOM);
    if (filteredAssets.length === 0) {
      return { balance: '0', denom: 'uusd', symbol: 'UST' };
    } else return filteredAssets[0];
  }, [assets]);

  const connectedWallet = useConnectedWallet();
  const walletAddress = connectedWallet?.terraAddress;
  const { rawData, isLoading } = useAccount(walletAddress);

  useEffect(() => {
    if (isTip) {
      setInput({ ...input, address: tipAddress, memo: TIP_MEMO });
    }
  }, [isTip, tipAddress]);

  useEffect(() => {
    const sortedAssets = rawData ? rawData.sort((a, b) => parseFloat(b?.balance) - parseFloat(a?.balance)) : [];
    setAssets(sortedAssets);
  }, [rawData]);

  useEffect(() => {
    if (isTip) {
      setAsset(ustAsset);
    } else if (assets.length > 0) {
      setAsset(assets[0]);
    }
  }, [assets, ustAsset, isTip]);

  const resetTxState = () => {
    if (isTxCalculated) {
      setIsTxCalculated(false);
      setTxFee(DEFAULT_TX_STATE);
    }
  };

  const onChange = (e: any) => {
    let value = e.target.value;
    const key = e.target.name;
    if (key === 'amount') {
      if (value !== '' && Math.sign(value) === -1) {
        value = (value * -1).toString();
      }
    }
    setInput({ ...input, [key]: value });
    resetTxState();
  };

  const isValidAddress = AccAddress.validate(input.address);

  const amountError = useMemo(() => {
    if (input.amount !== '') {
      if (!isTxCalculated) {
        const lengthError = input.amount.split('.')[1] ? !(input.amount.split('.')[1]?.length <= 6) : false;
        if (lengthError) {
          return { error: true, msg: AMOUNT_DECIMAL_ERROR };
        }
        if (+input.amount >= +selectedAsset?.balance) {
          return { error: true, msg: AMOUNT_ERROR };
        }
      } else if (isTxCalculated && !simulationLoading) {
        if (selectedAsset?.denom) {
          if (parseFloat(txFee) > parseFloat(ustAsset?.balance)) {
            return { error: true, msg: TAX_ERROR };
          }
        }
      }
    }
    return { error: false, msg: '' };
  }, [input.amount, txFee, isTxCalculated, simulationLoading, selectedAsset?.balance]);

  const isInvalidInput =
    amountError.error ||
    !isValidAddress ||
    input.address.trim() === '' ||
    input.amount.trim() === '' ||
    input.amount.trim() === '0';
  const isSendDisabled = amountError.error || simulationLoading || !isTxCalculated;
  const onAssetSelect = (asset: Holdings) => {
    setAsset(asset);
    resetTxState();
  };

  const getDisabledState = () => {
    if (simulationLoading) {
      return true;
    } else if (!isTxCalculated) {
      if (isInvalidInput) {
        return true;
      }
      return false;
    } else if (isSendDisabled) {
      return true;
    }
    return false;
  };

  const getNFTState = () => {
    return !isValidAddress || input.address.trim() === '';
  };

  const onSendNFTClick = async () => {
    onSend({ to: input.address, ...NFTData });
  };

  const onSendClick = async () => {
    if (!getDisabledState()) {
      if (!isTxCalculated) {
        setSimulationLoading(true);
        const data = {
          to: input.address,
          from: walletAddress,
          amount: input.amount,
          memo: input.memo,
          denom: selectedAsset?.denom,
          txDenom: UST_DENOM,
          contract: selectedAsset?.contract,
        };
        const result = await simulateSendTokenTx(data);
        if (!result.error) {
          setTxFee(result.fee);
          setIsTxCalculated(true);
        }
        setSimulationLoading(false);
      } else {
        const data = {
          to: input.address,
          from: walletAddress,
          amount: input.amount,
          memo: input.memo,
          denom: selectedAsset?.denom,
          txDenom: UST_DENOM,
          contract: selectedAsset?.contract,
        };
        resetTxState();
        setInput(DEFAULT_INPUT_STATE);
        onSend(data);
      }
    }
  };

  const showTxSymbol = () => {
    if (!isTxCalculated) {
      return '';
    } else {
      return 'UST';
    }
  };
  return (
    <ModalLarge>
      <ModalTitle>{NFTData?.isNFT ? 'Send NFT' : 'Send'}</ModalTitle>
      {NFTData?.isNFT ? (
        <>
          <NFTInputSection>
            <NFTItemContainer>
              <Image src={NFTData.data.src} />
              <NFTTextContainer>
                <NFTCollectionName>{NFTData.data.collection}</NFTCollectionName>
                <NFTItemName>{NFTData.data.name}</NFTItemName>
              </NFTTextContainer>
            </NFTItemContainer>
            <div style={{ height: '10px' }} />
            <Input
              disabled={isTip}
              defaultValue={isTip ? tipAddress : ''}
              error={input.address !== '' && !isValidAddress}
              onChange={onChange}
              name="address"
              type="text"
              placeholder="To Address"
            />
          </NFTInputSection>
          <ButtonContainer>
            <ButtonRound onClick={onSendNFTClick} disabled={getNFTState()}>
              {isTxCalculated ? 'Send' : 'Next'}
            </ButtonRound>
          </ButtonContainer>
        </>
      ) : (
        <>
          <InputSection>
            <InputContainer>
              <InputLabel>Send To</InputLabel>
              <Input
                disabled={isTip}
                defaultValue={isTip ? tipAddress : ''}
                error={input.address !== '' && !isValidAddress}
                onChange={onChange}
                name="address"
                type="text"
                placeholder="Address"
              />
            </InputContainer>
            <InputContainer>
              <InputLabel>Amount</InputLabel>
              <AmountBox error={amountError.error}>
                <CurrencySelect
                  loading={isLoading}
                  assets={assets}
                  selectedAsset={selectedAsset}
                  setAsset={onAssetSelect}
                />
                <AmountInput value={input.amount} onChange={onChange} name="amount" min="0" type="number" />
              </AmountBox>
              <BalanceContainer>
                <MsgText>{amountError.msg}</MsgText>
                <SmallText>Balance: {selectedAsset ? selectedAsset?.balance : '0.00'}</SmallText>
              </BalanceContainer>
            </InputContainer>
            <InputContainer>
              <InputLabel>Memo (Optional)</InputLabel>
              <Input
                disabled={isTip}
                defaultValue={isTip ? TIP_MEMO : ''}
                onChange={onChange}
                name="memo"
                type="text"
                placeholder="MEMO"
              />
            </InputContainer>
          </InputSection>
          <FeeSection>
            <SmallText fontWeight={500}>TxFee</SmallText>
            <SmallText>{simulationLoading ? 'Simulating...' : `${txFee} ${showTxSymbol()}`}</SmallText>
          </FeeSection>
          <ButtonContainer>
            <ButtonRound onClick={onSendClick} disabled={getDisabledState()}>
              {isTxCalculated ? 'Send' : 'Next'}
            </ButtonRound>
          </ButtonContainer>
        </>
      )}
    </ModalLarge>
  );
};
