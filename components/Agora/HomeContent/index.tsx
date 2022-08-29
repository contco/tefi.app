import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Box, Flex } from '@contco/core-ui';
import { SubHeader } from '../SubHeader';
import { Threads } from '../Threads';
import { ButtonRound } from '../../UIComponents';
import { useThreadsByCategory } from '../../../data/useThreadsByCategory';
import EmptyComponent from '../../EmptyComponent';

const LOADING_MORE_TEXT = 'Loading...';
const LOAD_BTN_TEXT = 'Load More';
const ERROR_MESSAGE = 'Error Fetching Data';

const HomeContainer = styled(Box)`
  ${css({
    width: ['100vw', null, null, null, null, null, null, 'calc(100vw - 400px)'],
  })}
`;

const LoadMoreContainer = styled(Flex)`
  ${css({
    justifyContent: 'center',
    alignItem: 'center',
    py: 4,
  })}
`;

export const AgoraHomeContent = ({ selectedCategory, setCategory }) => {
  const { threads, isReachingEnd, isLoadingMore, loadMore, isEmpty, isError } = useThreadsByCategory(selectedCategory);
  return (
    <HomeContainer>
      <SubHeader selectedCategory={selectedCategory} setCategory={setCategory} />
      {isEmpty || isError ? (
        <EmptyComponent msg={isError ? ERROR_MESSAGE : undefined} height="calc(100vh - 154px)" />
      ) : (
        <>
          <Threads threads={threads} />
          {!isReachingEnd ? (
            <LoadMoreContainer>
              <ButtonRound onClick={loadMore}>{isLoadingMore ? LOADING_MORE_TEXT : LOAD_BTN_TEXT}</ButtonRound>
            </LoadMoreContainer>
          ) : null}
        </>
      )}
    </HomeContainer>
  );
};
