
import styled, { keyframes } from 'styled-components';
import css from '@styled-system/css';
import { Flex, Text } from '@contco/core-ui';
import LIGHT_SWITCH_ICON from '../../public/light-switch.svg';
import DARK_SWITCH_ICON from '../../public/dark-switch.svg';
import WALLET_ICON from "../../public/wallet.svg";
import CLOSE_ICON from "../../public/close.svg";
import TEFI_LOGO from '../../public/tefi.svg';
import REFRESH_ICON from '../../public/refresh.svg';
import REFRESHING_ICON from '../../public/refreshing.svg';
import CHARTS_ICON from '../../public/charts.svg';
import MENU_ICON from '../../public/icons/circle-menu.svg';


export const Container = styled(Flex)`
${props => css({
  height: '64px',
  backgroundColor: props.theme.colors.background,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 1
})}
`;

export const LeftSection = styled(Flex)`
  ${css({
  flexDirection: 'row',
  alignItems: 'center',
  ml: 3,
})}
`;

export const StyledLogoIcon = styled(TEFI_LOGO)`
  ${props => css({
  transform: ['scale(0.6)', null, null, null, 'scale(0.7)'],
  '.tefi_svg__tirangleElement': {
    fill: props.theme.colors.secondary
  },
  '.tefi_svg__lineElement': {
    stroke: props.theme.colors.secondary
  },
  '.tefi_svg__circleElement': {
    fill: props.theme.colors.secondary,
    opacity: props.theme.opacity.logo
  }
})}
`;
export const StyledTitle = styled(Text)`
  ${props => css({
  color: props.theme.colors.secondary,
  fontSize: 26,
  fontWeight: 900,
  letterSpacing: 0.5,
  lineHeight: 0.88,
  cursor: 'pointer',
})}
 & > * {
   font-weight:500;
 }
`;

export const WalletCopyContainer = styled(Flex)`
  position: relative;
  justify-content: center;
  align-items:center;
`;

export const WalletCopyTooltip = styled(Flex)`
  position: absolute;
  width: 44px;
  height: 20px;
  top: 30px;
  left: 0px;
  font-size: 8px;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  z-index: 3;
  opacity: ${props => props.isVisible ? 1 : 0};
  ${css({
  bg: '#555',
  color: '#fff'
})}
`;
export const WalletIcon = styled(WALLET_ICON)`
.wallet_svg__iconElement  {
  transition: all 0.3s ease-in;
}

${props => css({
  transform: ['scale(0.6)', null, null, null, 'scale(0.5)'],
  '.wallet_svg__iconElement': {
    fill: props.theme.colors.secondary,
    width: 40,
  },
})}
  &:hover {
    opacity: 0.7;
  }
`;
export const StyledAddressText = styled(Text)`
transition: all 0.3s ease-in;
  ${props => css({
  color: props.theme.colors.secondary,
  fontSize: ['6px', null, '8px'],
  fontWeight: 900,
  letterSpacing: 0.5,
  lineHeight: 0.88,
  width: 60,
})}
`;
export const CloseIcon = styled(CLOSE_ICON)`
${css({
  transform: ['scale(0.5)', null, null, null, 'scale(0.5)'],
  width: 30,
  color: 'secondary'
})}
transition: all 0.3s ease-in;
  &:hover {
    opacity: 0.7;
  }
`;

export const RightSection = styled(Flex)`
  ${css({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  mr: 3,
})}
`;

export const WalletContainer = styled(Flex)`
&:hover ${WalletIcon} .wallet_svg__iconElement, &:hover ${StyledAddressText}, &:hover ${CloseIcon} {
  fill: ${props => props.theme.colors.background};  
  color: ${props => props.theme.colors.background}
};
transition: all 0.3s ease-in;
${props => css({
  width: 150,
  height: 35,
  borderRadius: 50,
  border: `solid 2px ${props.theme.colors.secondary}`,
  mr: [1, null, null, 3],
  cursor: 'pointer',
  justifyContent: 'space-between',
  alignItems: 'center',
  textAlign: 'center',
  p: 1,
  '&:hover': {
    bg: 'secondary'
  }
})}
`;
export const SwitchContainer = styled(Flex)`
  ${props => css({
  color: props.theme.colors.secondary,
  minWidth: [30, null, 40],
  justifyContent: 'center',
  alignItems: 'center',

})}
`;
export const LightSwitchIcon = styled(LIGHT_SWITCH_ICON)`
${css({
  transition: 'opacity 0.3s',
  cursor: 'pointer',
  ml: 3,
})}
  &:hover {
    opacity: 0.7;
  }
`;
export const DarkSwitchIcon = styled(DARK_SWITCH_ICON)`
${css({
  transition: 'opacity 0.3s',
  cursor: 'pointer',
  ml: 3,
})}
  &:hover {
    opacity: 0.7;
  }
`;
export const RefreshIcon = styled(REFRESH_ICON)`
${css({
  color: 'secondary',
  transition: 'opacity 0.3s',
  cursor: 'pointer',
  ml: 3,
})}
  &:hover {
    opacity: 0.7;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const AnimatedRefresh = styled(REFRESHING_ICON)`
  animation: ${rotate} 2s infinite;
  ${(props) =>
    css({
      color: 'secondary',
      ml: 3,
    })}
`;

export const ChartsIcon = styled(CHARTS_ICON)`
${css({
  transition: 'opacity 0.3s',
  cursor: 'pointer',
  ml: 3,
  color: 'secondary',
  mr: [2, null, null, 4],
})}
  &:hover {
    opacity: 0.7;
  }
`;


export const HoverContainer = styled(Flex)`
  ${css({
    justifyContent:'center',
    alignItems:'center',
    p:2,
    maxWidth: 'fit-content',
    borderRadius: '50%',
    transition: 'all ease-in 0.3s',
    '&:hover': {
        bg: 'focused',
    }
  })}
`;

export const StyledMenuIcon = styled(MENU_ICON)`
  ${css({
      color:'secondary',
  })}
`;
