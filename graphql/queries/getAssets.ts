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
          symbol
          lpName
          stakedLpUstValue
          availableLpUstValue
          ustStaked
          ustUnStaked
          tokenStaked
          tokenUnStaked
          availableLP
          stakedLP
          rewards
          rewardsValue
          apr
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
          symbol
          quantity
          price
          round
        }
        total {
          mirrorHoldingsSum
          mirrorPoolRewardsSum
          mirrorPoolSum
          mirrorAirdropSum
        }
      }
      anchor {
        assets {
          name
          symbol
          price
          balance
          value
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
          symbol
          lpName
          stakedLpUstValue
          availableLpUstValue
          ustStaked
          ustUnStaked
          tokenStaked
          tokenUnStaked
          stakedLP
          rewards
          rewardsValue
          availableLP
          apy
        }
        gov {
          reward {
            name
            staked
            reward
            apy
          }
          price
        }
        airdrops {
          name
          symbol
          quantity
          price
          round
        }
        total {
          airdropSum
          anchorRewardsSum
          anchorPoolSum
          anchorHoldingsSum
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
          stakedLpUstValue
          availableLpUstValue
          ustStaked
          ustUnStaked
          tokenStaked
          tokenUnStaked
          stakedLP
          rewards
          rewardsValue
          availableLP
          apy
        }
        pylonStakings  {
          symbol
          stakedValue
          rewards
          rewardsValue
          apy
          name
          balance
          totalValue
        }
        pylonAirdrops {
          name
          symbol
          price
          quantity
        }
        pylonSum {
          pylonHoldingsSum
          pylonStakingSum
          pylonPoolSum
          pylonPoolRewardsSum
          pylonAirdropSum
          pylonStakingRewardsSum
          gatewayRewardsSum
          gatewayDepositsSum
        }
        pylonGateway {
          symbol
          reward
          apy
          poolName
          deposit
          depositDate
          depositReleaseDate
          rewardReleaseDate
          rewardValue
        }
      }
    }
  }
`;
