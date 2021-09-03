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
interface Props {
    assets: [Holdings];
    selectedAsset: Holdings;
    setAsset: (asset: Holdings) => void;
}

export const CurrencySelect: React.FC<Props> = ({assets, selectedAsset, setAsset}) => {
    const [displayMenu, setDisplayMenu] = useState<boolean>(true);
    const selectRef = useRef();

    useOutsideClickListener(selectRef, () => {
        setDisplayMenu(false);
    });

    const onItemSelect = (currency: Holdings) => {
        setAsset(currency);
    }

    const getSelectedCurrency = () => { 
     if (selectedAsset) {
         return selectedAsset?.symbol?.length > 4 ? selectedAsset?.symbol.substr(0, 4) : selectedAsset.symbol;
     }
     return 'Select';
    }

  return (
      <Container ref={selectRef} onClick={() => setDisplayMenu(!displayMenu)}>
          <ContainerLabel>{getSelectedCurrency()}</ContainerLabel>
          <StyledArrowDownIcon/>
          <CurrencyMenu isVisible={displayMenu}>
              {assets.map(item => (
                <CurrencyItem onClick={() => onItemSelect(item)} key={item.contract || item.denom}>{item.symbol}</CurrencyItem>
              ))}
          </CurrencyMenu>
      </Container>

  )
}