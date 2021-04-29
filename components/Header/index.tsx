import React from 'react';
import { LIGHT_THEME } from '../../constants';
import { Container, LeftSection, HeaderTitle, StyledLogoIcon, RightSection, SwitchContainer, LightSwitchIcon, DarkSwitchIcon } from "./style";

type Props = {
  theme: string;
  changeTheme?: () => void;
};

const Header: React.FC<Props> = ({ theme, changeTheme }: any) => {
  return (
    <Container>
      <LeftSection>
        <StyledLogoIcon />
        <HeaderTitle>{'Tefi icon'}</HeaderTitle>
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
