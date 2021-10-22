import { gql } from '@apollo/client';

export const ADD_PROFILE_NFT = gql`
  mutation addProfileNft($input: [AddProfileNftInput!]!) {
    addProfileNft(input: $input) {
      profileNft {
        address
        url
        tokenId
      }
    }
  }
`;
