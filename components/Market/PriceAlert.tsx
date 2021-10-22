import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { useRouter } from 'next/router';
import { Box, Flex } from '@contco/core-ui';
import InfoTooltip from './InfoTooltip';
import { useAlertContext } from '../../providers/AlertProvider';
import useOutsideClickListener from '../../utils/useOutsideClickListener';
import { NotificationActive, NotificationOff } from '../Icons';
import { StyledInput } from '../dashboardStyles';
import Toggle from '../Toggle';

const Container = styled(Box)`
  ${css({
    color: 'secondary',
    ml: [0, null, 20],
    position: 'relative',
  })}
`;

const AlertContainer = styled(Flex)`
  ${(props) =>
    css({
      bg: 'background',
      flexDirection: 'column',
      justifyContent: 'space-around',
      position: 'absolute',
      width: 200,
      height: props.active ? 120 : 60,
      borderRadius: 20,
      left: -190,
      top: 50,
      px: 3,
      py: 3,
      zIndex: 1,
      color: 'secondary',
      boxShadow: props.theme.boxShadow,
      border: '1px solid #f2f2f2',
      visibility: props.showContainer ? 'visible' : 'hidden',
    })}
`;

const ActionContainer = styled(Flex)`
  justify-content: space-between;
  align-items: center;
`;

const ActionButton = styled(Box)`
  cursor: pointer;
`;

interface Props {
  currentPrice: string;
}

const PriceAlert: React.FC<Props> = ({ currentPrice }) => {
  const [showContainer, setShowContainer] = useState<boolean>(false);
  const [isAlertActive, setIsAlertActive] = useState<boolean>(true);
  const [priceInput, setPriceInput] = useState<string | null>('');
  const { alerts, setPriceAlert, cancelAlert, askNotificationPermission } = useAlertContext();
  const AlertRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const symbol = router.query.symbol as string;

  useEffect(() => {
    if (alerts[symbol]) {
      setIsAlertActive(true);
      setPriceInput(alerts[symbol].price);
    } else if (!alerts[symbol]) {
      setIsAlertActive(false);
      setPriceInput('');
    }
  }, [alerts, router.query.symbol]);

  useEffect(() => {
    if (showContainer) {
      setShowContainer(false);
    }
  }, [router.query.symbol]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceInput(e.target.value);
    if (e.target.value !== '') {
      setPriceAlert(symbol, e.target.value, currentPrice);
    }
  };

  const onToggle = (isActive: boolean) => {
    setIsAlertActive(isActive);
    if (isActive && priceInput !== '') {
      setPriceAlert(symbol, priceInput, currentPrice);
    } else if (!isActive) {
      cancelAlert(symbol);
      setPriceInput('');
    }
    askNotificationPermission();
  };

  const onOutsideClick = React.useCallback(() => {
    setTimeout(() => {
      if (showContainer) {
        setShowContainer(false);
      }
      if (isAlertActive && priceInput === '') {
        cancelAlert(symbol);
      }
    }, 200);
  }, [isAlertActive, priceInput, setShowContainer, showContainer]);

  useOutsideClickListener(AlertRef, onOutsideClick);

  return (
    <Container>
      <ActionButton>
        {isAlertActive ? (
          <NotificationActive onClick={() => setShowContainer(!showContainer)} />
        ) : (
          <NotificationOff onClick={() => setShowContainer(!showContainer)} />
        )}
      </ActionButton>
      <AlertContainer ref={AlertRef} active={isAlertActive} showContainer={showContainer}>
        <ActionContainer>
          <Toggle active={isAlertActive} onToggle={onToggle} />
          <InfoTooltip />
        </ActionContainer>
        {isAlertActive ? (
          <StyledInput onChange={onInputChange} value={priceInput} type="number" placeholder="Enter Price" />
        ) : null}
      </AlertContainer>
    </Container>
  );
};

export default PriceAlert;
