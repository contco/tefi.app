import React from 'react';
import { Box } from '@contco/core-ui';
import { SubHeader } from '../SubHeader';
import { Threads } from '../Threads';

export const AgoraHomeContent = ({ selectedCategory, setCategory }) => {
  return (
    <Box>
      <SubHeader selectedCategory={selectedCategory} setCategory={setCategory} />
      <Threads />
    </Box>
  );
};
