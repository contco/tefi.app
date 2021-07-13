import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getAccountData } from './getAccountData';

const typeDefs = gql`
  type MirrorStaking {
    symbol: String!
    lpName: String!
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

  type Account {
    mirrorStaking: [MirrorStaking!]
    mirrorHoldings: [MirrorHoldings!]
    total: MirrorTotal
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
    }
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
