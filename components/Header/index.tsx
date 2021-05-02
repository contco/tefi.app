import React from 'react';
import { LIGHT_THEME } from '../../constants';
import { Container, LeftSection, StyledLogoIcon, StyledTitle, RightSection, WalletContainer, SwitchContainer, LightSwitchIcon, DarkSwitchIcon } from "./style";

type Props = {
  theme: string;
  changeTheme?: () => void;
};
const ADDRESS = `terra15s0q4u4cpvsxgyygm7wy70q9tq0nnr8fg0m1q3`
const Header: React.FC<Props> = ({ theme, changeTheme }: any) => {
  return (
    <Container>
      <LeftSection>
        <StyledLogoIcon />
        <StyledTitle >
          Tefi<span>App</span>
        </StyledTitle>
      </LeftSection>
      <RightSection>
        <WalletContainer>

        </WalletContainer>
        <SwitchContainer>
          {theme === LIGHT_THEME ? <LightSwitchIcon onClick={changeTheme} /> : <DarkSwitchIcon onClick={changeTheme} />}
        </SwitchContainer>
      </RightSection>
    </Container>
  );
};

export default Header;
