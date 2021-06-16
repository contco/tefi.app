import { gql } from 'graphql-tag';

export const GET_ANC_ACCOUNT_DATA = gql`
  query getAncAccount($address: String!) {
    assets(address: $address) {
      anchor {
        assets {
          amount
          symbol
          price
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
        rewarding
      }
    }
  }
`;
