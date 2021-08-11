import React from 'react';
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
import CHARTS_ICON from '../../public/charts.svg';
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

const Section = styled(Flex)`
  ${css({
      boxSizing:'border-box',
      color: 'secondary',
      mx: 2,
  })}
`;

const TopSection = styled(Section)`
  ${props => css({
      height: props.address ? 84 : 120,
  })}
`;

const BottomSection = styled(Section)`
  ${css({
      height: 80,
  })}
`;
const Divider = styled(Box)`
  ${css({
      boxSizing:'border-box',
      minHeight: 1,
      width: 'auto',
      bg: 'focused',
      my: 2,
      mx:2,
  })}
`;

const ChartsIcon = styled(CHARTS_ICON)`
  ${css({
      transform: 'scale(0.8)'
  })}
`;

const LightIcon = styled(LightSwitchIcon)`
${css({
    transform: 'scale(0.8)'
})}
`;

const DarkIcon = styled(DarkSwitchIcon)`
${css({
    transform: 'scale(0.8)'
})}
`;


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

    const onOutsideClick =  React.useCallback(() => {
        setTimeout(() => {
            if(isVisible){
                setVisibility(false);
            }
        }, 100)
       
    }, [setVisibility, isVisible]);

    useOutsideClickListener(MenuRef, onOutsideClick);

   const onLinkClick = (url: string) => {
        setTimeout(() => window.open(url, '_blank'), 300);
    }

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
        <TopSection address={address} height={100}>
            <HoverContainer onClick={() => onLinkClick('/market')}>
                <ChartsIcon/>
            </HoverContainer>
        </TopSection>
        <Divider />
        <BottomSection>
         <HoverContainer onClick={() => onLinkClick('https://terra.mirror.finance/')}>
         <img src="https://whitelist.mirror.finance/icon/MIR.png" alt='Mirror Protocol' height={24} width={24} />
         </HoverContainer>
         <HoverContainer onClick={() => onLinkClick('https://anchorprotocol.com/')}>
         <img src="https://whitelist.anchorprotocol.com/logo/ANC.png" alt="Anchor Protocol" height={24} width={24} />
         </HoverContainer>
         <HoverContainer onClick={() => onLinkClick('https://app.pylon.money/')}>
         <img src="https://assets.pylon.rocks/logo/MINE.png" alt="Pylon Protocol" height={24} width={24} />
         </HoverContainer>
         <HoverContainer onClick={() => onLinkClick('https://terra.spec.finance/')}>
         <img src="https://raw.githubusercontent.com/spectrumprotocol/frontend/master/src/assets/SPEC.png" alt='Spectrum Protocol' height={24} width={24} />
         </HoverContainer>
         <HoverContainer onClick={() => onLinkClick('https://loterra.io/')}>
         <img src="https://raw.githubusercontent.com/LoTerra/loterra-interface/master/static/LOTA.png" alt="LoTerra Protocol" height={24} width={24} />
         </HoverContainer>
        </BottomSection>
        </Box>
        <ThemeIconContainer>
        <SwitchContainer>
          {theme === LIGHT_THEME ? <LightIcon onClick={changeTheme} /> : <DarkIcon onClick={changeTheme} />}
        </SwitchContainer>
        </ThemeIconContainer>
        </MenuContainer>
        </Parent>
    )
};

export default Menu;