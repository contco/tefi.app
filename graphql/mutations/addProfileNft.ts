import { gql } from '@apollo/client';

export const ADD_PROFILE_NFT = gql`
  mutation addProfileNft($input: [AddProfileNftInput!]! ) {
    profileNft {
      address
      url
    }
  }
`;
