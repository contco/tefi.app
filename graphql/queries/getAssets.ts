import {gql} from "@apollo/client";

export const getAssets = gql`
query getAssets($address: String!) {
  assets(address: $address) {
    address
    core {
      coins {
        balance
        amount
        price
        symbol
        name
      }
      total {
        assetsSum
      }
    }
    mirror {
      assets {
        apr
        ustStaked
        symbol
        amount
        balance
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