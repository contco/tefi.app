import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import {Flex, Box} from "@contco/core-ui";
import useOutsideClickListener from "../../utils/useOutsideClickListener";
import { 
    HoverContainer,
    SwitchContainer,
    LightSwitchIcon,
    DarkSwitchIcon,
    AnimatedRefresh,
    RefreshIcon,
    DashboardIcon
} from './style';
import { useRouter } from 'next/router';

import CHARTS_ICON from '../../public/charts.svg';
import Mirror from '../../public/icons/mirror.svg';
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
       height: 300,
       width:220,
       zIndex: props.isVisible ? 2 : -1,
       visibility: props.isVisible ? 'visible' : 'hidden',
       boxShadow: props.theme.boxShadow,
   })}
   border: 1px solid #f2f2f2;
   border-radius: 6px;
`;

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
  ${css({
      height: 120,
      pt:3,

  })}
`;

const BottomSection = styled(Section)`
  ${css({
      height: 80,
      flexDirection: 'column',
      pt:3,
  })}
`;
const Divider = styled(Box)`
  ${css({
      minHeight: 1,
      width: 'auto',
      my: 2,
  })}
  border: 0.5px solid #f2f2f2
`;

const ChartsIcon = styled(CHARTS_ICON)``;

const StyledHover = styled(HoverContainer)`
 ${css({
     mx: '14px',
 })}
`
const SectionRow = styled(Flex)`
 align-items: center;
 height: 40px;
 ${css({
      mb: 2
  })}
`;

interface Props {
    isVisible?: boolean;
    refreshing: boolean;
    theme: string;
    setVisibility: (visibility: boolean) => void;
    changeTheme: () => void;
    onRefresh?: () => void;
}

const Menu: React.FC<Props> = ({isVisible = false, setVisibility, theme, changeTheme, onRefresh, refreshing}) => {
    const router = useRouter();
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

    const onInternalLinkClick = (url: string) => {
        setTimeout(() => router.push(url), 300);
    }

    return (
        <Parent>
        <MenuContainer ref={MenuRef} isLight={theme === LIGHT_THEME} isVisible={isVisible}>
        <Box>
        <TopSection>
            <SectionRow>
            <StyledHover onClick={() => onInternalLinkClick('/dashboard')}>
                <DashboardIcon/>
            </StyledHover>
            <StyledHover onClick={() => onInternalLinkClick('/market')}>
                <ChartsIcon/>
            </StyledHover>
            </SectionRow>
        </TopSection>
        <Divider />
        <BottomSection>
         <SectionRow >
         <StyledHover onClick={() => onLinkClick('https://terra.mirror.finance/')}>
         <img src="https://whitelist.mirror.finance/icon/MIR.png" alt='Mirror Protocol' height={26} width={26} />
         </StyledHover>
         <StyledHover onClick={() => onLinkClick('https://anchorprotocol.com/')}>
         <img src="https://whitelist.anchorprotocol.com/logo/ANC.png" alt="Anchor Protocol" height={26} width={26} />
         </StyledHover>
         <StyledHover onClick={() => onLinkClick('https://app.pylon.money/')}>
         <img src="https://assets.pylon.rocks/logo/MINE.png" alt="Pylon Protocol" height={26} width={26} />
         </StyledHover>
         </SectionRow>
         <Flex mt={3}>
         <StyledHover onClick={() => onLinkClick('https://terra.spec.finance/')}>
         <img src="https://raw.githubusercontent.com/spectrumprotocol/frontend/master/src/assets/SPEC.png" alt='Spectrum Protocol' height={26} width={26} />
         </StyledHover>
         <StyledHover onClick={() => onLinkClick('https://loterra.io/')}>
         <img src="https://raw.githubusercontent.com/LoTerra/loterra-interface/master/static/LOTA.png" alt="LoTerra Protocol" height={26} width={26} />
         </StyledHover>
         </Flex>
        </BottomSection>
        </Box>
        <ThemeIconContainer>
        <SwitchContainer>
          {onRefresh && (!refreshing ? <RefreshIcon onClick={onRefresh} /> : <AnimatedRefresh />)}
          {theme === LIGHT_THEME ? <LightSwitchIcon onClick={changeTheme} /> : <DarkSwitchIcon onClick={changeTheme} />}
        </SwitchContainer>
        </ThemeIconContainer>
        </MenuContainer>
        </Parent>
    )
};

export default Menu;