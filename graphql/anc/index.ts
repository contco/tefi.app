import { gql } from '@apollo/client';

export const GET_EARN_DATA = gql`
query GET_EARN_DATA($address: String!) {
    getEarnData(address: $address) {
      apy
      totalDesposit
    }
  }
`;