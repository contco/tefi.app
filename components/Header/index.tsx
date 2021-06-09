import React from 'react';
import { LIGHT_THEME } from '../../constants';
import { Container, LeftSection, StyledLogoIcon, StyledTitle, RightSection, WalletContainer, WalletIcon, StyledAddressText, CloseIcon, SwitchContainer, LightSwitchIcon, DarkSwitchIcon } from "./style";
import useWallet from "../../lib/useWallet";

type Props = {
  theme: string;
  changeTheme?: () => void;
  address?: string;
};
const Header: React.FC<Props> = ({ theme, changeTheme, address }) => {
  const slicedAddress = `${address?.slice(0, 6) + '....' + address?.slice(address?.length - 6, address?.length)}`
  const {disconnect} = useWallet();
  const onDisconnect = () => {
    disconnect();
  }
  return (
    <Container>
      <LeftSection>
        <StyledLogoIcon />
        <StyledTitle >
          Tefi<span>App</span>
        </StyledTitle>
      </LeftSection>
      <RightSection>
        {address ?
          <WalletContainer>
            <WalletIcon />
            <StyledAddressText>
              {slicedAddress}
            </StyledAddressText>
              <CloseIcon onClick={onDisconnect}/>
          </WalletContainer>
          : ''}
        <SwitchContainer>
          {theme === LIGHT_THEME ? <LightSwitchIcon onClick={changeTheme} /> : <DarkSwitchIcon onClick={changeTheme} />}
        </SwitchContainer>
      </RightSection>
    </Container>
  );
};

export default Header;
