import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import css from '@styled-system/css';
import {Flex, Box} from "@contco/core-ui";
import useOutsideClickListener from "../../utils/useOutsideClickListener";
import { 
    WalletContainer,
    WalletCopyContainer,
    WalletCopyTooltip,
    StyledAddressText,
    WalletIcon,
    CloseIcon,
    HoverContainer,
    SwitchContainer,
    LightSwitchIcon,
    DarkSwitchIcon,
} from './style';
import ChartsIcon from '../../public/charts.svg';
import { LIGHT_THEME } from '../../constants';

const Parent = styled(Box)`
 ${css({
    position: 'absolute',
    top: 60,
    right: 14,
    height: 280,
    width:220,
 })}
`;

const MenuContainer = styled(Flex)`
   ${props => css({
       position: 'fixed',
       flexDirection:'column',
       justifyContent:'space-between', 
       ml:'auto',
       bg:'background',
       height: 280,
       width:220,
       zIndex: props.isVisible ? 2 : -1,
       visibility: props.isVisible ? 'visible' : 'hidden',
       boxShadow: props.theme.boxShadow,
       
   })}
`;

const MobileWallet = styled(Flex)`
  ${css({
      width:'100%',
      justifyContent:'center',
      alignItems: 'center',
      py: 2,
  })}
`

const ThemeIconContainer = styled(Flex)`
  ${css({
      justifyContent:'flex-end',
      alignItems:'flex-end', 
      p:3,
  })}
`

const ChartIconContainer = styled(Box)`
  display: inline-block;
  ${css({
      color: 'secondary',
      ml: 25,
      mt: 3,
  })}
`

interface Props {
    isVisible?: boolean;
    copyVisible?: boolean;
    theme: string;
    address: string;
    setVisibility: (visibility: boolean) => void;
    changeTheme: () => void;
    onCopyClick: () => void;
    onDisconnect: () => void;
}

const Menu: React.FC<Props> = ({isVisible = false, copyVisible = false, setVisibility, address, onCopyClick, onDisconnect, theme, changeTheme}) => {

    const MenuRef = React.useRef<HTMLDivElement | null>(null);
    const router = useRouter();
    const onOutsideClick =  React.useCallback(() => {
        setVisibility(false);
    }, [setVisibility]);
    useOutsideClickListener(MenuRef, onOutsideClick);
    return (
        <Parent>
        <MenuContainer ref={MenuRef} isLight={theme === LIGHT_THEME} isVisible={isVisible}>
        <Box>
        <MobileWallet>
            {address ? (
                <WalletContainer >
                    <WalletCopyContainer onClick={onCopyClick} >
                        <WalletIcon/>
                        <WalletCopyTooltip isVisible={copyVisible}>Copied!</WalletCopyTooltip>
                    </WalletCopyContainer>
                    <StyledAddressText>{address}</StyledAddressText>
                    <CloseIcon onClick={onDisconnect} />
                </WalletContainer>
        ) : 
          null
        }
        </MobileWallet>
        <ChartIconContainer>
            <HoverContainer id='blue'>
                <ChartsIcon onClick={() => router.push('/market')}/>
            </HoverContainer>
        </ChartIconContainer>
        </Box>
        <ThemeIconContainer>
        <SwitchContainer>
          {theme === LIGHT_THEME ? <LightSwitchIcon onClick={changeTheme} /> : <DarkSwitchIcon onClick={changeTheme} />}
        </SwitchContainer>
        </ThemeIconContainer>
        </MenuContainer>
        </Parent>
    )
};

export default Menu;