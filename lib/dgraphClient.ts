import { useMemo } from 'react';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import fetch from 'cross-fetch';

const authToken = process.env.DGRAPH_API_KEY;

const httpLink = createHttpLink({
  uri: process.env.DGRAPH_API_URL,
  fetch,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'DG-Auth': authToken ?? undefined,
    },
  };
});

export const useDgraphClient = () => {
  const client = useMemo(
    () =>
      new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
      }),
    [],
  );
  return client;
};
