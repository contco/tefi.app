import {gql} from "@apollo/client";

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