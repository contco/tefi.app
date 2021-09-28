import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box } from '@contco/core-ui';
import useOutsideClickListener from '../../utils/useOutsideClickListener';
import { LightSwitchIcon, DarkSwitchIcon, AnimatedRefresh, RefreshIcon } from './style';
import { useRouter } from 'next/router';
import { useModalContext } from '../../contexts';

import { LIGHT_THEME } from '../../constants';
import Section from './Section';

import { INTERNAL_LINKS, PROTOCOL_LINKS, TOOLS_LINKS, COMMUNITY_TOOLS_LINKS, UPCOMING_PROTOCOL_LINKS } from './data';

const Parent = styled(Box)`
  ${(props) =>
    css({
      position: 'absolute',
      top: 60,
      right: 14,
      minHeight: 369,
      width: 270,
      visibility: props.isVisible ? 'visible' : 'hidden',
    })}
`;

const InneContainer = styled(Flex)`
  ${css({
    height: 360,
  })}
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const MenuContainer = styled(Flex)`
  ${(props) =>
    css({
      position: 'fixed',
      flexDirection: 'column',
      justifyContent: 'space-between',
      bg: 'background',
      height: 369,
      width: 270,
      zIndex: props.isVisible ? 3 : -1,
      boxShadow: props.theme.boxShadow,
    })}
  border: 1px solid #f2f2f2;
  border-radius: 6px;
`;

export const BottomContainer = styled(Flex)`
  border-top: 1px solid #f2f2f2;
  ${(props) =>
    css({
      color: props.theme.colors.secondary,
      justifyContent: 'flex-end',
      alignItems: 'center',
      p: 2,
    })}
`;

const Divider = styled.div`
  border-top: 1px solid #f2f2f2;
`;

interface Props {
  isVisible?: boolean;
  refreshing: boolean;
  theme: string;
  setVisibility: (visibility: boolean) => void;
  changeTheme: () => void;
  onRefresh?: () => void;
}

const Menu: React.FC<Props> = ({
  isVisible = false,
  setVisibility,
  theme,
  changeTheme,
  onRefresh,
  refreshing,
}: any) => {
  const router = useRouter();
  const MenuRef = React.useRef<HTMLDivElement | null>(null);
  const InnerContainerRef = React.useRef<HTMLDivElement | null>(null);

  const {sendModal} = useModalContext();

  const onClose = () => {
    setVisibility(false);
    InnerContainerRef && InnerContainerRef?.current?.scrollTo(0, 0);
  };

  const onOutsideClick = React.useCallback(() => {
    setTimeout(() => {
      if (isVisible) {
        onClose();
      }
    }, 100);
  }, [setVisibility, isVisible]);

  useOutsideClickListener(MenuRef, onOutsideClick);

  const onLinkClick = (url: string) => {
    onClose();
    setTimeout(() => window.open(url, '_blank'), 300);
  };

  const onInternalLinkClick = (url: string) => {
    onClose();
    if(url) {
      setTimeout(() => router.push(url), 300);
    }
    else {
      sendModal.setVisible(true);
    }
  };

  return (
    <Parent isVisible={isVisible}>
      <MenuContainer ref={MenuRef} isLight={theme === LIGHT_THEME} isVisible={isVisible}>
        <InneContainer ref={InnerContainerRef}>
          <Section className='internalSection' data={INTERNAL_LINKS} onItemClick={onInternalLinkClick} />
          <Divider />
          <Section data={TOOLS_LINKS} onItemClick={onLinkClick} />
          <Divider />
          <Section data={PROTOCOL_LINKS} onItemClick={onLinkClick} />
          <Divider />
          <Section data={COMMUNITY_TOOLS_LINKS} onItemClick={onLinkClick} />
          <Divider />
          <Section data={UPCOMING_PROTOCOL_LINKS} onItemClick={onLinkClick} />
        </InneContainer>
        <BottomContainer>
          {onRefresh && (!refreshing ? <RefreshIcon onClick={onRefresh} /> : <AnimatedRefresh />)}
          {theme === LIGHT_THEME ? <LightSwitchIcon onClick={changeTheme} /> : <DarkSwitchIcon onClick={changeTheme} />}
        </BottomContainer>
      </MenuContainer>
    </Parent>
  );
};

export default Menu;
