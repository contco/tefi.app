import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Flex } from '@contco/core-ui';
import { ReplyView } from '../ReplyView';
import { ButtonRound } from '../../UIComponents';
import { useRepliesByThread } from '../../../data/useRepliesByThread';

const LOADING_MORE_TEXT = 'Loading...';
const LOAD_BTN_TEXT = 'Load More';

const LoadMoreContainer = styled(Flex)`
  ${css({
    justifyContent: 'center',
    alignItem: 'center',
    py: 4,
  })}
`;
interface Props {
  threadId: number | null;
}
export const Replies: React.FC<Props> = ({ threadId }) => {
  const { replies, loadMore, isLoadingMore, isReachingEnd } = useRepliesByThread(threadId);
  return (
    <Box>
      {replies.map((reply: Reply) => (
        <ReplyView key={reply.comment_id} reply={reply} />
      ))}
      {!isReachingEnd ? (
        <LoadMoreContainer>
          <ButtonRound onClick={loadMore}>{isLoadingMore ? LOADING_MORE_TEXT : LOAD_BTN_TEXT}</ButtonRound>
        </LoadMoreContainer>
      ) : null}
    </Box>
  );
};
