import React from 'react';
import { SubHeader } from '../SubHeader';
import { Threads } from '../Threads';
import { Box } from '@contco/core-ui';

export const AgoraHomeContent = ({ selectedCategory, setCategory }) => {
  return (
    <Box>
      <SubHeader selectedCategory={selectedCategory} setCategory={setCategory} />
      <Threads />
    </Box>
  );
};
