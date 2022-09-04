import useSWRInfinite from 'swr/infinite';
import axios from 'axios';
import { CLUB_SERVER_ROOT } from '../constants';

const DEFAULT_LIMIT = 10;

const getKey = (pageIndex: number, previousPageData: any, category: string) => {
  if (!category) return null;
  if (pageIndex === 0) return `${CLUB_SERVER_ROOT}/dagora/threads/${category}?limit=${DEFAULT_LIMIT}&isTestnet=true`;

  if (!previousPageData) return null;

  const offset = DEFAULT_LIMIT * pageIndex;

  return `${CLUB_SERVER_ROOT}/dagora/threads/${category}?limit=${DEFAULT_LIMIT}&offset=${offset}&isTestnet=true`;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useThreadsByCategory = (category: string) => {
  const { data, error, size, setSize } = useSWRInfinite(
    (index: number, data: any) => getKey(index, data, category),
    fetcher,
  );
  const isLoadingInitialData = !data && !error;
  const isLoadingMore = size > 0 && data && typeof data[size - 1] === 'undefined';
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < DEFAULT_LIMIT);

  const loadMore = () => {
    if (!isReachingEnd) {
      setSize(size + 1);
    }
  };

  const threads: Thread[] = data ? data.reduce((acm, page) => [...acm, ...page], []) : [];

  const state = {
    threads,
    size,
    setSize,
    isLoading: isLoadingInitialData,
    isLoadingMore,
    isError: error,
    isReachingEnd,
    loadMore,
    isEmpty,
  };

  return state;
};
