import useSWRInfinite from 'swr/infinite';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CLUB_SERVER_ROOT } from '../constants';

const DEFAULT_LIMIT = 10;

const getKey = (pageIndex: number, previousPageData: any, id: number | null) => {
  if (!id) return null;
  if (pageIndex === 0)
    return `${CLUB_SERVER_ROOT}/dagora/thread/${id}/replies?limit=${DEFAULT_LIMIT}&isTestnet=${
      process.env.NEXT_PUBLIC_IS_TESTNET ? true : false
    }`;

  if (!previousPageData) return null;

  const offset = DEFAULT_LIMIT * pageIndex;

  return `${CLUB_SERVER_ROOT}/dagora/thread/${id}/replies?limit=${DEFAULT_LIMIT}&offset=${offset}&isTestnet=${
    process.env.NEXT_PUBLIC_IS_TESTNET ? true : false
  }`;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useRepliesByThread = (id: number | null) => {
  const { data, error, size, setSize, mutate } = useSWRInfinite(
    (index: number, data: any) => getKey(index, data, id),
    fetcher,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = size > 0 && data && typeof data[currentPage - 1] === 'undefined';
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < DEFAULT_LIMIT);
  const showLoadMore = size === 1 && isReachingEnd && isLoadingInitialData ? false : currentPage !== size;

  useEffect(() => {
    if (size === 1 && !isLoadingInitialData && !isReachingEnd) {
      setSize(size + 1);
    }
  }, [size, isLoadingInitialData]);
  const loadMore = () => {
    if (!isReachingEnd) {
      setSize(size + 1);
    }
    setCurrentPage(currentPage + 1);
  };

  const allReplies: Reply[] = data ? data.reduce((acm, page) => [...acm, ...page], []) : [];
  const pageReplies = allReplies.slice(0, DEFAULT_LIMIT * currentPage);
  const state = {
    replies: pageReplies,
    size,
    setSize,
    isLoading: isLoadingInitialData,
    isLoadingMore,
    isError: error,
    isReachingEnd,
    loadMore,
    isEmpty,
    mutate,
    showLoadMore,
  };

  return state;
};
