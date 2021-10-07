import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Menu from './Menu';
import {
  Container,
  LeftSection,
  StyledTitle,
  RightSection,
  WalletContainer,
  WalletCopyContainer,
  WalletCopyTooltip,
  WalletIcon,
  StyledAddressText,
  CloseIcon,
  HoverContainer,
  StyledMenuIcon,
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
  isViewOnly?: boolean;
  logoSub?: string;
};

const Header: React.FC<Props> = ({ theme, changeTheme, address, addressType, onRefresh, refreshing, isViewOnly = false, logoSub = 'App' }) => {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);

  const slicedAddress =
    address && `${address?.slice(0, 6) + '....' + address?.slice(address?.length - 6, address?.length)}`;

  const onCopyClick = () => {
    setVisible(true);
    navigator.clipboard.writeText(address);

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

  const onMenuClick = () => {
    if (!displayMenu) {
      setDisplayMenu(true);
    }
  };
  return (
    <>
      <Container>
        <LeftSection>
          <StyledTitle onClick={() => router.push('/')}>
            <span>{""}</span>
          </StyledTitle>
        </LeftSection>
        <RightSection>
          {slicedAddress ? (
            <WalletContainer>
              <WalletCopyContainer onClick={onCopyClick}>
                <WalletIcon />
                <WalletCopyTooltip isVisible={isVisible}>Copied!</WalletCopyTooltip>
              </WalletCopyContainer>
              <StyledAddressText>{slicedAddress}</StyledAddressText>
             <CloseIcon showIcon={!isViewOnly} onClick={onDisconnect} />
            </WalletContainer>
          ) : null}
          <HoverContainer isActive={displayMenu} onClick={onMenuClick}>
            <StyledMenuIcon />
          </HoverContainer>
        </RightSection>
      </Container>
      <Menu
        theme={theme}
        changeTheme={changeTheme}
        isVisible={displayMenu}
        setVisibility={setDisplayMenu}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </>
  );
};

export default Header;
