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
  }

  type AssetsTotal {
    rewardsSum: String!
    stakedSum: String!
    unstakedSum: String!
  }

  type Account {
    assets: [AccountAssets!]
    total: AssetsTotal
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
