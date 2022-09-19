import React, { useMemo } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Text } from '@contco/core-ui';
import { RawViewer } from '@contco/editor';

const Container = styled(Box)`
  ${css({
    width: ['100vw', null, null, null, null, null, null, 'calc(100vw - 400px)'],
    color: 'secondary',
  })}
`;

const ThreadTitle = styled(Text)`
  ${({theme}) => css({
    fontSize: [3, null, null, null, null, null, null, 4],
    fontWeight: 'bold',
    py: 3,
    px: 2,
    mr: [4, null, null, null, null, null, null, 2],
    ml: [4, null, null, null, null, null, null, 2],
    borderBottom: `0.5px solid ${theme.colors.background2}`
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

const StyledViewer = styled(RawViewer)`
  ${css({
    minHeight: 300,
    color: 'text3',
    px: 2,
  })}
`;

interface Props {
  thread: Thread;
}

export const ThreadDetail: React.FC<Props> = ({ thread }) => {
  const rawContent = useMemo(() => JSON.parse(thread.content), [thread.content]);
  return (
    <Container>
      <ThreadTitle>{thread.title}</ThreadTitle>
      <ThreadContent>
        <StyledViewer data={rawContent} />
      </ThreadContent>
    </Container>
  );
};
