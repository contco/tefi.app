import React, {useState, useRef} from 'react';
import styled from 'styled-components';
import css from "@styled-system/css";
import { Flex, Text } from '@contco/core-ui';
import { ArrowDownIcon } from '../Icons';
import useOutsideClickListener from '../../utils/useOutsideClickListener';

const Container = styled(Flex)`
  position: relative;
  width: 100px;
  ${css({
    bg: 'postBg',
    color: 'secondary',
    alignItems: 'center',
    justifyContent: 'space-around',
    px: 2,
    height: [28, null, 38, 48],
    cursor: 'pointer',
  })}
`;

 
const ContainerLabel = styled(Text)`
${css({
    color: 'secondary',
    fontSize: [1,null, null, null, 2],
    letterSpacing: 1,
  })}
`;

const StyledArrowDownIcon = styled(ArrowDownIcon)`
  transform: scale(0.7);
`;

const CurrencyMenu = styled(Flex)`
    -ms-overflow-style: none; 
    scrollbar-width: none;
    ::-webkit-scrollbar { 
        display: none;
    }
  ${props => css({
      flexDirection: 'column',
      position: 'absolute',
      height: 100,
      width: 80,
      bg: 'background',
      boxShadow: props.theme.boxShadow,
      bottom: -90,
      right: 3,
      overflowY: 'auto',
      visibility: props.isVisible ? 'visible' : 'hidden'
  })}
`;

const CurrencyItem = styled(Text)`
${css({
    bg: 'background',
    transition: 'background-color 0.2s ease-in',
    textAlign:'center',
    p: 2,
    fontSize: 0,
    '&:hover': {
        bg: 'postBg',
    }
})}
`;

const list = [{id: '1', symbol: 'UST'}, {id:'2', symbol: 'MINE'}, {id: '3', symbol: 'mTWTR'}, {id: '4', symbol: 'ANC'}];

export const CurrencySelect: React.FC = () => {
    const [displayMenu, setDisplayMenu] = useState<boolean>(true);
    const [selectedCurrency, setSelectedCurrency] = useState('UST');
    const selectRef = useRef();

    useOutsideClickListener(selectRef, () => {
        setDisplayMenu(false);
    });

    const onItemSelect = (currency) => {
        setSelectedCurrency(currency.symbol);
    }

  return (
      <Container ref={selectRef} onClick={() => setDisplayMenu(!displayMenu)}>
          <ContainerLabel>{selectedCurrency.length > 4 ? selectedCurrency.substr(0, 4) : selectedCurrency}</ContainerLabel>
          <StyledArrowDownIcon/>
          <CurrencyMenu isVisible={displayMenu}>
              {list.map(item => (
                <CurrencyItem onClick={() => onItemSelect(item)} key={item.id}>{item.symbol}</CurrencyItem>
              ))}
          </CurrencyMenu>
      </Container>

  )
}