import React from 'react';
import { Modal, Box, Text, Flex } from '@contco/core-ui';
import css from '@styled-system/css';
import styled from 'styled-components';
import { ClaimButton } from '../dashboardStyles';
import useFee from '../../utils/useFee';
import { UNIT } from '../../pages/api/mirror/utils';

const ModalBox = styled(Box)`
  ${css({
    bg: 'background',
    height: [200, null, null, 280],
    width: [300, null, null, 600],
  })}
`;

const Title = styled(Text)`
  ${css({
    fontWeight: 'bold',
    color: 'secondary',
    fontSize: [2, null, null, 4],
    textAlign: 'center',
    py: 4,
  })}
`;
const Section = styled(Flex)`
  ${css({
    alignItems: 'center',
    justifyContent: 'space-between',
    px: 4,
    my: [2, null, null, 4],
  })}
`;

const AmountText = styled(Text)`
  ${css({
    fontSize: [1, null, null, 2],
    color: 'secondary',
  })}
`;

const FeeText = styled(Text)`
  ${css({
    fontSize: [0, null, null, 1],
    color: 'secondary',
  })}
`;

const ButtonWrap = styled(Box)`
  ${css({
    width: [120, null, null, 200],
    mx: 'auto',
  })}
`;

interface Props {
  showModal: boolean;
  amount: string;
  airdropLength: number;
  loading: boolean;
  onClaimClick: any;
  setModalVisible: any;
}

export const AirdropModal: React.FC<Props> = ({ showModal, setModalVisible, amount, airdropLength }) => {
  const getTxFee = () => {
    const { amount } = useFee(airdropLength);
    return amount / UNIT;
  };
  return (
    <Modal isOpen={showModal} onClose={() => setModalVisible(false)}>
      <ModalBox>
        <Title>Claim All Airdrops</Title>
        <Section>
          <AmountText fontWeight="bold">Amount</AmountText>
          <AmountText fontWeight="bold">{amount}</AmountText>
        </Section>
        <Section>
          <FeeText>TxFee</FeeText>
          <FeeText>${getTxFee()}</FeeText>
        </Section>
        <ButtonWrap>
          <ClaimButton disabled onClick={() => null}>
            {'coming soon'}
          </ClaimButton>
        </ButtonWrap>
      </ModalBox>
    </Modal>
  );
};
