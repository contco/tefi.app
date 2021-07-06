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
        mirrorStaking {
          apr
          ustStaked
          symbol
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
        mirrorHoldings {
          name
          symbol
          price
          balance
          value
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
          percentage
          price
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
          stakedValue
          stakableValue
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
        totalReward
      }
      pylon  {
        pylonHoldings {
          symbol
          name
          price
          balance
          value
        }
        pylonPool {
          symbol
          lpName
          stakedLP
          rewards
          rewardsValue
          availableLP
          apy
        }
        pylonAirdrops {
          name
          price
          quantity
        }
      }
    }
  }
`;
