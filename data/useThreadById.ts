import useSWR from 'swr';
import axios from 'axios';
import { CLUB_SERVER_ROOT } from '../constants';

const getKey = (id: string) => {
  if (!id) return null;
  return `${CLUB_SERVER_ROOT}/dagora/thread/${id}?isTestnet=${process.env.NEXT_PUBLIC_IS_TESTNET ? true : false}`;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useThreadById = (id: string) => {
  const { data, error } = useSWR(getKey(id), fetcher);
  const isLoading = !data && !error;

  const state = {
    isLoading,
    thread: data as Thread,
    isError: error,
  };

  return state;
};
