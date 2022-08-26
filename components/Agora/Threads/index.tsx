import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Flex, Box, Text } from '@contco/core-ui';

const ThreadItem = styled(Flex)`
  ${css({
    width: ['100vw', null, null, null, null, null, null, 'calc(100vw - 400px)'],
    p: 3,
    borderBottom: '1px solid',
    borderColor: 'divider',
    minHeight: 100,
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    color: 'detailsText',
    '&:hover': {
      bg: 'hoverBackground',
    },
  })}
`;

const ThreadTitle = styled(Text)`
  ${css({
    fontSize: [2, null, null, null, null, null, null, 3],
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
    fontSize: [0, null, null, null, null, null, null, 1],
  })}
`;

interface Props {
  threads: Thread[];
}

export const Threads: React.FC<Props> = ({ threads }) => {
  return (
    <Box>
      {threads.map((thread) => (
        <ThreadItem key={thread.id}>
          <ThreadTitle>{thread.title}</ThreadTitle>
          <InfoContainer>
            <InfoText>{thread.category}</InfoText>
            <InfoText>
              {thread.author.substring(0, 15) +
                '....' +
                thread.author.substring(thread.author.length - 4, thread.author.length - 1)}
            </InfoText>
          </InfoContainer>
        </ThreadItem>
      ))}
    </Box>
  );
};
