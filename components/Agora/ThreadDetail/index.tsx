import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Text } from '@contco/core-ui';

const Container = styled(Box)`
  ${css({
    width: ['100vw', null, null, null, null, null, null, 'calc(100vw - 400px)'],
    color: 'secondary',
  })}
`;

const ThreadTitle = styled(Text)`
  box-shadow: rgba(0, 0, 0, 0.45) 0px 25px 20px -20px;
  ${css({
    fontSize: [3, null, null, null, null, null, null, 4],
    fontWeight: 'bold',
    py: 3,
    px: 2,
    mr: [4, null, null, null, null, null, null, 2],
    ml: [4, null, null, null, null, null, null, 0],
  })}
`;

const ThreadContent = styled(Text)`
  ${css({
    my: 4,
    letterSpacing: 2,
    lineHeight: 1.5,
    px: [4, null, null, null, null, null, null, 0],
    fontSize: [1, null, null, null, null, null, null, 3],
  })}
`;

const THREAD_DETAIL = {
  id: 2,
  title: 'A new thread on terra agora!',
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  category: 'General',
  author: 'terra15xjvvkatfuqneg4tqwju7ulse35hnnjf8r4pd3',
};

export const ThreadDetail = () => {
  return (
    <Container>
      <ThreadTitle>{THREAD_DETAIL.title}</ThreadTitle>
      <ThreadContent>
        <Text>{THREAD_DETAIL.content}</Text>
      </ThreadContent>
    </Container>
  );
};
