import React, { useState } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box, Text } from '@contco/core-ui';
import useOutsideClickListener from '../../../utils/useOutsideClickListener';

const THREAD_CATEGORIES = [
  { id: 1, category: 'General' },
  { id: 2, category: 'Governance And Proposals' },
  { id: 3, category: 'DApp Development' },
];

const Container = styled(Box)`
  ${css({
    position: 'relative',
    border: '1px solid',
    borderColor: 'inputBorder',
    borderRadius: '25px',
    height: 32,
    maxWidth: 120,
    px: 2,
    boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
    color: 'detailsText',
  })}
`;

const SelectContainer = styled(Flex)`
  ${css({
    height: '100%',
    width: '100%',
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      opacity: 0.7,
    },
    transition: 'all 0.3s',
  })}
`;

const SelectedCategoryText = styled(Text)`
  ${css({
    fontWeight: 'bold',
    fontSize: 0,
    maxWidth: 220,
  })}
`;

const DropDown = styled(Box)`
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  ${(props) =>
    css({
      maxHeight: 200,
      width: 200,
      overflowY: 'auto',
      position: 'absolute',
      top: 36,
      left: 0,
      bg: 'primary',
      display: props.showDropDown ? 'initial' : 'none',
    })}
`;

const DropDownItem = styled(Text)`
  ${(props) =>
    css({
      py: 2,
      px: 3,
      fontSize: 0,
      borderBottom: '1px solid',
      borderColor: 'divider',
      bg: props.selected ? 'background2' : '#fff',
      color: '#000',
      opacity: props.selected ? 0.8 : 1,
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.6,
      },
      transition: '0.1s',
    })}
`;

export const CategoryDropDown = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('General');
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const dropDownRef = React.useRef<HTMLDivElement | null>(null);

  const onOutsideClick = () => {
    setTimeout(() => {
      if (showDropDown) {
        setShowDropDown(false);
      }
    }, 200);
  };

  useOutsideClickListener(dropDownRef, onOutsideClick);

  const onSelectClick = () => {
    setShowDropDown(true);
  };

  return (
    <Container>
      <SelectContainer onClick={onSelectClick}>
        <SelectedCategoryText>
          {selectedCategory.length > 16 ? selectedCategory.slice(0, 12) + '...' : selectedCategory}
        </SelectedCategoryText>
      </SelectContainer>
      <DropDown ref={dropDownRef} showDropDown={showDropDown}>
        {THREAD_CATEGORIES.map((item) => (
          <DropDownItem
            onClick={() => setSelectedCategory(item.category)}
            key={item.id}
            selected={item.category === selectedCategory}
          >
            {item.category}
          </DropDownItem>
        ))}
      </DropDown>
    </Container>
  );
};
