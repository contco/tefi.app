import { gql } from '@apollo/client';

export const getAssets = gql`
  query getAssets($address: String!) {
    assets(address: $address) {
      address
     core {
      coins {
        balance
        value
        price
        symbol
        name
      }
      staking {
        balance
        rewards
        stakedValue
        rewardsValue
        totalValue
        validator
      }
      total {
        assetsSum
        stakedSum
      }
    }
    mirror {
      assets {
        apr
        ustStaked
        symbol
        balance
        value
        tokenStaked
        tokenStakedUstValue
        stakeTotalUstValue
        poolTotalWithRewards
        price
        name
        rewards
        rewardsUstValue
        lpBalance
      }
      airdrops {
        name
        quantity
        price 
        round
      }
      total {
        stakedSum
        rewardsSum
        unstakedSum
        airdropSum
      }
    }
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
          anc
          ust
          value
        }
        gov {
          reward {
            name
            staked
            reward
            apy
          }
        }
        airdrops {
          name
          quantity
          price
          round
        }
        total {
          airdropSum
        }
      }
    }
  }
`;
