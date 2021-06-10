import React from 'react';
import { useRouter } from 'next/router';
import { LIGHT_THEME } from '../../constants';
import { Container, LeftSection, StyledLogoIcon, StyledTitle, RightSection, WalletContainer, WalletIcon, StyledAddressText, CloseIcon, SwitchContainer, LightSwitchIcon, DarkSwitchIcon } from "./style";
import useWallet from "../../lib/useWallet";

import {WALLET_ADDRESS_TYPE, LOCAL_ADDRESS_TYPE, ADDRESS_KEY} from "../../constants";


type Props = {
  theme: string;
  changeTheme?: () => void;
  address?: string;
  addressType?: string;
};
const Header: React.FC<Props> = ({ theme, changeTheme, address, addressType }) => {
  const slicedAddress = `${address?.slice(0, 6) + '....' + address?.slice(address?.length - 6, address?.length)}`
  const {disconnect} = useWallet();
  const router = useRouter();

  const onDisconnect = () => {
    if(addressType === WALLET_ADDRESS_TYPE) {
    disconnect();
    }
    if (addressType === LOCAL_ADDRESS_TYPE) {
      localStorage.removeItem(ADDRESS_KEY);
      router.push("/");
    }
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
