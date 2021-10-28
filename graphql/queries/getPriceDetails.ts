import { gql } from '@apollo/client';

export const SUBSCRIBE_TOKEN_PRICE_DETAILS = gql`
  subscription QueryTokenPriceDetails(
    $filter: TokenHistoricalPriceFilter
    $order: TokenHistoricalPriceOrder
    $first: Int
    $offset: Int
  ) {
    queryTokenPriceDetails {
      dailyChange
      dailyChangePercent
      denom
      price
      symbol
      url
      tokenAddress
      historicalData(filter: $filter, first: $first, offset: $offset, order: $order) {
        price
        timeframe
        timestamp
      }
    }
  }
`;
