import React, {useState} from 'react';
import { LIGHT_THEME } from '../../constants';
import { Container, LeftSection, StyledLogoIcon, StyledTitle, RightSection, WalletContainer,WalletCopyContainer, WalletCopyTooltip, WalletIcon, StyledAddressText, CloseIcon, SwitchContainer, LightSwitchIcon, DarkSwitchIcon } from "./style";
import Link from 'next/link'

type Props = {
  theme: string;
  changeTheme?: () => void;
  address?: string;
};
const Header: React.FC<Props> = ({ theme, changeTheme, address }) => {
  const slicedAddress = `${address?.slice(0, 6) + '....' + address?.slice(address?.length - 6, address?.length)}`
  const [isVisible ,setVisible] = useState<boolean>(false);
  const onCopyClick = () => {
        navigator.clipboard.writeText(address);
        setVisible(true);
        setTimeout(() => setVisible(false), 1000);
    };
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
            <WalletCopyContainer>
              <WalletIcon onClick={onCopyClick} />
              <WalletCopyTooltip isVisible={isVisible}>Copied!</WalletCopyTooltip>
            </WalletCopyContainer>
            <StyledAddressText>
              {slicedAddress}
            </StyledAddressText>
            <Link href="/">
              <CloseIcon />
            </Link>
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
