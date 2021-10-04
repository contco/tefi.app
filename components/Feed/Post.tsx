import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Text, Avatar } from '@contco/core-ui';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { TIP_ICON } from '../Icons';
import { useModalContext } from '../../contexts';
import { CLUB_DEPOSIT_ADDRESS, LIGHT_THEME } from '../../constants';

const Container = styled.div`
  width: 100%;
  ${(props) =>
    css({
      height: [300, null, null, 300, null, 250],
      mb: [40, null, null, 60, null, 80],
      px: 4,
      py: 4,
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
  line-height: 22px;
  font-weight: 400;
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
  margin-left: 9px;
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
  align-items: flex-end;
`;

const MemoSection = styled(Flex)`
  ${css({
    height: 'calc(100% - 80px)',
    py: 4,
    wordWrap: 'break-word',
  })}
`;

const TopLeft = styled(Flex)`
  align-items: center;
  ${css({})}
`;

const TipIcon = styled(TIP_ICON)`
  ${css({
    color: 'secondary',
    transform: 'scale(0.8)',
    transition: ' opacity 0.3s ease-in',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.7,
    },
  })}
`;
const Post = ({ data: { memo, from_address: address, block, timestamp }, currentTheme }: any) => {
  // temp - hide send out transaction
  if (block == 4728937) return <></>;

  const router = useRouter();
  const { sendTip } = useModalContext();

  let slicedAddress =
    address && `${address?.slice(0, 6) + '....' + address?.slice(address?.length - 6, address?.length)}`;
  slicedAddress = address == CLUB_DEPOSIT_ADDRESS ? 'TefiApp' : slicedAddress;

  let image = currentTheme === LIGHT_THEME ? '/images/dp_light.png' : '/images/dp_dark.png';
  let logo = currentTheme === LIGHT_THEME ? '/images/logo_light.png' : '/images/logo_dark.png';
  image = address == CLUB_DEPOSIT_ADDRESS ? logo : image;

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
  };

  return (
    <Container>
      <TopSection>
        <TopLeft>
          <Avatar image={image} name="Hello" height={33} width={33} />
          <AddressText onClick={onAddressClick}>{slicedAddress}</AddressText>
        </TopLeft>
        <StyledText>{block ? new Intl.NumberFormat().format(block) : 'pending'}</StyledText>
      </TopSection>
      <MemoSection>
        <MemoText>{memo}</MemoText>
      </MemoSection>
      <BottomSection>
        {address === CLUB_DEPOSIT_ADDRESS ? <div /> : <TipIcon onClick={onTipClick} />}
        {displayTimestamp()}
      </BottomSection>
    </Container>
  );
};

export default Post;
