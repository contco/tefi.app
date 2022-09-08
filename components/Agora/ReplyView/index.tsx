import React, { useMemo } from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Text } from '@contco/core-ui';
import { RawViewer } from '@contco/editor';

const Container = styled(Box)`
  ${css({
    width: ['100vw', null, null, null, null, null, null, 'calc(100vw - 400px)'],
    px: 4,
  })}
`;

const ContentBox = styled(Box)`
  ${css({
    width: '100%',
    maxWidth: 900,
    bg: 'postBg',
    color: 'secondary',
    px: 3,
    py: 1,
    my: 4,
    letterSpacing: 2,
    lineHeight: 1.5,
    fontSize: [1, null, null, null, null, null, null, 3],
  })}
`;

const StyledViewer = styled(RawViewer)`
  ${css({
    minHeight: 100,
    color: 'text3',
    px: 2,
  })}
`;

const AddressText = styled(Text)`
  ${css({
    p: 2,
    color: 'text3',
    textAlign: 'right',
    fontSize: [1, null, null, null, null, null, null, 1],
  })}
`;

interface Props {
  reply: Reply;
}

export const ReplyView: React.FC<Props> = ({ reply }) => {
  const rawContent = useMemo(() => JSON.parse(reply?.comment), [reply?.comment]);
  return (
    <Container>
      <ContentBox>
        <StyledViewer data={rawContent} />
        <AddressText>
          {' '}
          {reply.author.substring(0, 15) +
            '....' +
            reply.author.substring(reply.author.length - 4, reply.author.length - 1)}
        </AddressText>
      </ContentBox>
    </Container>
  );
};
