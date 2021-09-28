import { gql } from '@apollo/client';

export const GET_ASSET_SUPPLY = gql`
  subscription getAssetSupply {
    queryAssetSupply {
      current
      day
      hour
      month
      week
      symbol
    }
  }
`;
