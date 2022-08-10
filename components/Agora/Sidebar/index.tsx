import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Text } from '@contco/core-ui';
import { THREAD_CATEGORIES } from '../categories';

const AGORA_TITLE = 'Discussions';

const AgoraTitle = styled(Text)`
  ${css({
    textAlign: 'center',
    width: '100%',
    color: 'secondary',
    fontSize: 4,
    fontWeight: 'bold',
    py: 3,
  })}
`;

const Container = styled(Box)`
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  ${css({
    p: 3,
    width: 400,
    minHeight: 'calc(100vh - 64px)',
    display: ['none', null, null, null, null, null, null, 'initial'],
  })}
`;

const SidebarItem = styled(Text)`
  ${(props) =>
    css({
      p: 4,
      fontSize: 2,
      fontWeight: 'bold',
      color: 'detailsText',
      cursor: 'pointer',
      bg: props.isSelected ? 'hoverBackground' : 'background',
      '&:hover': {
        bg: 'hoverBackground',
      },
      mt: 1,
      transition: '0.3s',
    })}
`;

export const Sidebar = ({ selectedCategory, setCategory }) => {
  return (
    <Container>
      <AgoraTitle>{AGORA_TITLE}</AgoraTitle>
      {THREAD_CATEGORIES.map((category) => (
        <SidebarItem
          onClick={() => setCategory(category.category)}
          isSelected={selectedCategory === category.category}
          key={category.id}
        >
          {category.category}
        </SidebarItem>
      ))}
    </Container>
  );
};
