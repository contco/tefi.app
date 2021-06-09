import { gql } from '@apollo/client';

export const GET_ANC_ACCOUNT_DATA = gql`
  query getAncAccount($address: String!) {
    assets(address: $address) {
      anchor {
        asset {
          amount
          symbol
        }
        debt {
          reward {
            name
            apy
            staked
            reward
          }
          collaterals {
            balance
            collateral
          }
          value
        }

        earn {
          reward {
            name
            staked
            apy
            reward
          }
        }

        pool {
          reward {
            name
            staked
            apy
            reward
          }
          balance
        }
        gov {
          reward {
            name
            staked
            reward
            apy
          }
        }
      }
    }
  }
`;
