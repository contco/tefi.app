import React from 'react';
import { Box } from '@contco/core-ui';
import { ReplyView } from '../ReplyView';

const DUMMY_REPLIES: Reply[] = [
  {
    id: 1,
    comment: '[{"type":"paragraph","children":[{"text":"test123"}]}]',
    author: 'terra1mf8kss6fdq338hs7ltxksea83sndmarp4rpkqq',
  },
  {
    id: 2,
    comment: '[{"type":"paragraph","children":[{"text":"abcdsflfdkl32 3232"}]}]',
    author: 'terra1mf8kss6fdq338hs7ltxksea83sndmarp4rpkqq',
  },
];

export const Replies: React.FC = () => {
  return (
    <Box>
      {DUMMY_REPLIES.map((reply: Reply) => (
        <ReplyView key={reply.id} reply={reply} />
      ))}
    </Box>
  );
};
