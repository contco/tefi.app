import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getAccountData } from './getAccountData';

const typeDefs = gql`
  type AccountAssets {
    symbol: String!
    apr: String!
    unstakedToken: String
    unstakedUstValue: String
    ustStaked: String
    tokenStaked: String
    tokenStakedUstValue: String
    stakeTotalUstValue: String
    poolTotalWithRewards: String
    rewards: String
    rewardsUstValue: String
    price: String
    name: String
    lpBalance: String
  }

  type AssetsTotal {
    rewardsSum: String!
    stakedSum: String!
    unstakedSum: String!
  }

  type Airdrops {
    price: String
    quantity: String
    round: Int
    symbol: String
  }

  type Account {
    assets: [AccountAssets!]
    total: AssetsTotal
    airdrops: [Airdrops!]
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
