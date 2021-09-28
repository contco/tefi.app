import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Text } from '@contco/core-ui';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { TIP_ICON } from '../Icons';
import { useModalContext } from '../../contexts';

const Container = styled.div`
  width: 100%;
  ${(props) =>
    css({
      height: [200, null, null, 200, null, 250],
      mb: [40, null, null, 60, null, 80],
      px: 4,
      bg: 'background',
      borderRadius: 20,
      boxShadow: props.theme.postShadow,
    })}
`;

const StyledText = styled(Text)`
  ${css({
    fontSize: [0, null, null, 1, null, 1],
    fontWeight: 500,
    color: 'secondary',
  })}
`;

const MemoText = styled(StyledText)`
  line-height: 20px;
  ${css({
    color: 'postPrimary',
  })}
`;

const DateText = styled(StyledText)`
  ${css({
    textAlign: 'right',
  })}
`;

const AddressText = styled(StyledText)`
  cursor: pointer;
`;

const Section = styled(Flex)`
  align-items: center;
  height: 40px;
`;

const TopSection = styled(Section)`
  justify-content: space-between;
`;

const BottomSection = styled(Section)`
  justify-content: space-between;
`;

const MemoSection = styled(Flex)`
  ${css({
    height: 'calc(100% - 80px)',
    py: 4,
    wordWrap: 'break-word',
  })}
`;

const TipIcon = styled(TIP_ICON)`
  ${css({
    color: 'secondary',
    transform: 'scale(0.8)',
    transition: ' opacity 0.3s ease-in',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    }
  })}
`;
const Post = ({ data: { memo, from_address: address, block, timestamp } }: any) => {
  const router = useRouter();
  const {sendTip} = useModalContext();

  const slicedAddress =
    address && `${address?.slice(0, 6) + '....' + address?.slice(address?.length - 6, address?.length)}`;

  const displayTimestamp = () => {
    if (!timestamp) {
      return <DateText>pending</DateText>;
    } else {
      const date = new Date(timestamp);
      return (
        <DateText>
          {format(date, 'd/MM/y')} &nbsp; &nbsp; {format(date, 'h:mm a')}
        </DateText>
      );
    }
  };

  const onAddressClick = () => {
    setTimeout(() => router.push(`/dashboard/${address}`), 300);
  };

  const onTipClick = () => {
    sendTip(address);
  }

  return (
    <Container>
      <TopSection>
        <AddressText onClick={onAddressClick}>{slicedAddress}</AddressText>
        <StyledText>{block ? new Intl.NumberFormat().format(block) : 'pending'}</StyledText>
      </TopSection>
      <MemoSection>
        <MemoText>{memo}</MemoText>
      </MemoSection>
      <BottomSection>
         <TipIcon onClick={onTipClick} />
        {displayTimestamp()}
        </BottomSection>
    </Container>
  );
};

export default Post;
