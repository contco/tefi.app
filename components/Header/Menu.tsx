import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box } from '@contco/core-ui';
import useOutsideClickListener from '../../utils/useOutsideClickListener';
import { LightSwitchIcon, DarkSwitchIcon, AnimatedRefresh, RefreshIcon } from './style';
import { useRouter } from 'next/router';

import { LIGHT_THEME } from '../../constants';
import Section from './Section';

import { INTERNAL_LINKS, PROTOCOL_LINKS, UPCOMING_PROTOCOL_LINKS } from './data';

const Parent = styled(Box)`
  ${(props) => css({
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
      zIndex: props.isVisible ? 2 : -1,
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

  const onOutsideClick = React.useCallback(() => {
    setTimeout(() => {
      if (isVisible) {
        setVisibility(false);
      }
    }, 100);
  }, [setVisibility, isVisible]);

  useOutsideClickListener(MenuRef, onOutsideClick);

  const onLinkClick = (url: string) => {
    setVisibility(false);
    setTimeout(() => window.open(url, '_blank'), 300);
  };

  const onInternalLinkClick = (url: string) => {
    setVisibility(false);
    setTimeout(() => router.push(url), 300);
  };

  return (
    <Parent isVisible={isVisible}>
      <MenuContainer ref={MenuRef} isLight={theme === LIGHT_THEME} isVisible={isVisible}>
        <InneContainer>
          <Section data={INTERNAL_LINKS} onItemClick={onInternalLinkClick} />
          <Divider />
          <Section data={PROTOCOL_LINKS} onItemClick={onLinkClick} />
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
