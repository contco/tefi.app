import { gql } from '@apollo/client';

export const UPDATE_PROFILE_NFT = gql`
  mutation updateProfileNft($input: UpdateProfileNftInput! ) {
    updateProfileNft(input: $input) {
      profileNft {
        address
        url
        tokenId
      }
    }  
  }
`;
