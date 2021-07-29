import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { LIGHT_THEME } from '../../constants';
import {
  Container,
  LeftSection,
  StyledLogoIcon,
  StyledTitle,
  RightSection,
  WalletContainer,
  WalletCopyContainer,
  WalletCopyTooltip,
  WalletIcon,
  StyledAddressText,
  CloseIcon,
  SwitchContainer,
  LightSwitchIcon,
  DarkSwitchIcon,
  RefreshIcon,
  AnimatedRefresh,
} from './style';

import useWallet from '../../lib/useWallet';

import { WALLET_ADDRESS_TYPE, LOCAL_ADDRESS_TYPE, ADDRESS_KEY } from '../../constants';

type Props = {
  theme: string;
  changeTheme?: () => void;
  address?: string;
  addressType?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
};
const Header: React.FC<Props> = ({ theme, changeTheme, address, addressType, onRefresh, refreshing }) => {
  const slicedAddress = `${address?.slice(0, 6) + '....' + address?.slice(address?.length - 6, address?.length)}`;
  const [isVisible, setVisible] = useState<boolean>(false);

  const onCopyClick = () => {
    navigator.clipboard.writeText(address);
    setVisible(true);
    setTimeout(() => setVisible(false), 1000);
  };
  const { disconnect } = useWallet();
  const router = useRouter();

  const onDisconnect = () => {
    if (addressType === WALLET_ADDRESS_TYPE) {
      disconnect();
    }
    if (addressType === LOCAL_ADDRESS_TYPE) {
      localStorage.removeItem(ADDRESS_KEY);
      router.push('/');
    }
  };
  return (
    <Container>
      <LeftSection>
        <StyledTitle>
          Tefi<span>App</span>
        </StyledTitle>
      </LeftSection>
      <RightSection>
        {address ? (
          <WalletContainer onClick={onCopyClick}>
            <WalletCopyContainer>
              <WalletIcon />
              <WalletCopyTooltip isVisible={isVisible}>Copied!</WalletCopyTooltip>
            </WalletCopyContainer>
            <StyledAddressText>{slicedAddress}</StyledAddressText>
            <CloseIcon onClick={onDisconnect} />
          </WalletContainer>
        ) : (
          ''
        )}
        <SwitchContainer>
          {theme === LIGHT_THEME ? <LightSwitchIcon onClick={changeTheme} /> : <DarkSwitchIcon onClick={changeTheme} />}
        </SwitchContainer>
        {address && (!refreshing ? <RefreshIcon onClick={onRefresh} /> : <AnimatedRefresh />)}
      </RightSection>
    </Container>
  );
};

export default Header;
