import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getAccountData } from './getAccountData';

const typeDefs = gql`
  type MirrorStaking {
    symbol: String!
    lpName: String!
    lpShortName: String!
    stakedLpUstValue: String!
    availableLpUstValue: String!
    ustStaked: String!
    ustUnStaked: String!
    tokenStaked: String!
    tokenUnStaked: String!
    availableLP: String!
    stakedLP: String!
    rewards: String!
    rewardsValue: String!
    rewardsSymbol: String!
    apr: String!
    shortApr: String!
    isShort: Boolean
  }

  type MirrorHoldings {
    symbol: String!
    name: String!
    balance: String!
    value: String!
    price: String!
  }

  type MirrorTotal {
    mirrorHoldingsSum: String!
    mirrorPoolRewardsSum: String!
    mirrorPoolSum: String!
    mirrorAirdropSum: String!
  }

  type Airdrops {
    price: String!
    quantity: String!
    round: Int!
    name: String!
    symbol: String!
  }

  type MirrorGov {
    name: String!
    symbol: String!
    staked: String!
    value: String!
    rewards: String!
    price: String!
    apr: String!
  }

  type AssetInfo {
    idx: String!
    name: String
    price: String
    symbol: String
  }

  type BorrowInfo {
    amount: String
    amountValue: String
    shortApr: String
  }

  type CollateralInfo {
    collateral: String
    collateralValue: String
    collateralRatio: String
    csymbol: String
  }

  type LockedInfo {
    locked_amount: String
    unlocked_amount: String
    unlock_time: String
    reward: String
    rewardValue: String
    shorted: String
  }

  type MirrorShortFarm {
    assetInfo: AssetInfo
    borrowInfo: BorrowInfo
    collateralInfo: CollateralInfo
    lockedInfo: LockedInfo
  }

  type Account {
    mirrorStaking: [MirrorStaking!]
    mirrorHoldings: [MirrorHoldings!]
    gov: MirrorGov
    total: MirrorTotal
    airdrops: [Airdrops!]
    mirrorShortFarm: [MirrorShortFarm!]
  }
  extend type Assets @key(fields: "address") {
    address: String! @external
    mirror: Account
  }
`;

const resolvers = {
  Assets: {
    mirror(assets) {
      return getAccountData(assets.address);
    },
  },
};

const apolloServer = new ApolloServer({ schema: buildFederatedSchema([{ typeDefs, resolvers }]) });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({
  path: '/api/mirror',
});
