import { gql } from 'graphql-request';

export const GET_PAIRS_DATA = gql`
  query PairData($to: Float!, $from: Float!, $interval: Interval!, $pairAddresses: [String!]!) {
    pairs(pairAddresses: $pairAddresses) {
      pairAddress
      token0 {
        symbol
      }
      token1 {
        symbol
      }
      latestToken0Price
      latestToken1Price
      historicalData(to: $to, from: $from, interval: $interval) {
        timestamp
        token0Price
        token1Price
      }
    }
  }
`;
