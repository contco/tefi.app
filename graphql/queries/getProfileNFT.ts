import { gql } from '@apollo/client';

export const GET_PROFILE_NFT = gql`
  query getProfileNft($address: String! ) {
    getProfileNft(address: $address) {
      address
      url
    }
  }
`;
