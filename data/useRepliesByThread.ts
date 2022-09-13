import useSWRInfinite from 'swr/infinite';
import axios from 'axios';
import { CLUB_SERVER_ROOT } from '../constants';

const DEFAULT_LIMIT = 10;

const getKey = (pageIndex: number, previousPageData: any, id: number | null) => {
  if (!id) return null;
  if (pageIndex === 0) return `${CLUB_SERVER_ROOT}/dagora/thread/${id}/replies?limit=${DEFAULT_LIMIT}&isTestnet=true`;

  if (!previousPageData) return null;

  const offset = DEFAULT_LIMIT * pageIndex;

  return `${CLUB_SERVER_ROOT}/dagora/thread/${id}/replies?limit=${DEFAULT_LIMIT}&offset=${offset}&isTestnet=true`;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useRepliesByThread = (id: number | null) => {
  const { data, error, size, setSize, mutate } = useSWRInfinite(
    (index: number, data: any) => getKey(index, data, id),
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

  const replies: Reply[] = data ? data.reduce((acm, page) => [...acm, ...page], []) : [];

  const state = {
    replies,
    size,
    setSize,
    isLoading: isLoadingInitialData,
    isLoadingMore,
    isError: error,
    isReachingEnd,
    loadMore,
    isEmpty,
    mutate,
  };

  return state;
};
