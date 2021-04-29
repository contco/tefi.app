import React from 'react';
import { LIGHT_THEME } from '../../constants';
import { Container, LeftSection, StyledLogoIcon, RightSection, SwitchContainer, LightSwitchIcon, DarkSwitchIcon } from "./style";

type Props = {
  theme: string;
  changeTheme?: () => void;
};

const Header: React.FC<Props> = ({ theme, changeTheme }: any) => {
  return (
    <Container>
      <LeftSection>
        <StyledLogoIcon />
      </LeftSection>
      <RightSection>
        <SwitchContainer>
          {theme === LIGHT_THEME ? <LightSwitchIcon onClick={changeTheme} /> : <DarkSwitchIcon onClick={changeTheme} />}
        </SwitchContainer>
      </RightSection>
    </Container>
  );
};

export default Header;
