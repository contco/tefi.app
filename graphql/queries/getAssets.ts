import {gql} from "@apollo/client";

export const getAssets = gql`
query getAssets($address: String!) {
  assets(address: $address) {
    address
    mirror {
      assets {
        apr
        ustStaked
        symbol
        unstakedToken
        unstakedUstValue
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
        symbol
        quantity
        price 
        round
      }
      total {
        stakedSum
        rewardsSum
        unstakedSum
      }
    }
  }
}
`;