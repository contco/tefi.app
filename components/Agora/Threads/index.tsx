import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box, Text } from '@contco/core-ui';

const THREADS_DATA = [
  { id: 1, title: 'Getting Started on Agora (Commonwealth): Walk-through', category: 'General' },
  { id: 2, title: 'Getting Started on Agora (Commonwealth): Walk-through', category: 'General' },
  { id: 3, title: 'Getting Started on Agora (Commonwealth): Walk-through', category: 'General' },
  { id: 4, title: 'Getting Started on Agora (Commonwealth): Walk-through', category: 'General' },
];

const ADDRESS = 'terra15xjvvkatfuqneg4tqwju7ulse35hnnjf8r4pd3';

const ThreadItem = styled(Flex)`
  ${css({
    width: '100vw',
    p: 3,
    borderBottom: '1px solid',
    borderColor: 'divider',
    minHeight: 100,
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    color: 'detailsText',
  })}
`;

const ThreadTitle = styled(Text)`
  ${css({
    fontSize: 2,
    fontWeight: 'bold',
  })}
`;

const InfoContainer = styled(Flex)`
  ${css({
    justifyContent: 'space-between',
  })}
`;

const InfoText = styled(Text)`
  ${css({
    fontSize: 0,
  })}
`;

export const Threads = () => {
  return (
    <Box>
      {THREADS_DATA.map((thread) => (
        <ThreadItem key={thread.id}>
          <ThreadTitle>{thread.title}</ThreadTitle>
          <InfoContainer>
            <InfoText>General</InfoText>
            <InfoText>
              {ADDRESS.substring(0, 15) + '....' + ADDRESS.substring(ADDRESS.length - 4, ADDRESS.length - 1)}
            </InfoText>
          </InfoContainer>
        </ThreadItem>
      ))}
    </Box>
  );
};
