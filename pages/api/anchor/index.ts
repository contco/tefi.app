import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getBalance } from './lib/anc';
import getBorrowData from './lib/borrow';
import getEarnData from './lib/earn';
import getLPData from './lib/lp';
import getGovData from './lib/gov';

const typeDefs = gql`
  type Token {
    symbol: String!
    amount: String!
    price: String!
    staked: String
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    anchor: [Token]
  }

  type Reward {
    name: String
    staked: String
    apy: String
    reward: String
  }

  type UserCollateral {
    collateral: String
    balance: String
  }

  type BorrowData {
    reward: Reward
    limit: String!
    value: String!
    collaterals: UserCollateral!
  }

  type EarnData {
    reward: Reward
  }

  type LPData {
    reward: Reward!
    balance: String!
  }

  type GovData {
    reward: Reward!
  }

  type Query {
    getBorrowData(address: String!): BorrowData
    getEarnData(address: String!): EarnData
    getLPData(address: String!): LPData
    getGovData(address: String): GovData
  }
`;

const resolvers = {
  Assets: {
    anchor(assets) {
      return getBalance(assets.address);
    },
  },

  Query: {
    getBorrowData(_, args) {
      return getBorrowData(args?.address);
    },
    getEarnData(_, args) {
      return getEarnData(args?.address);
    },
    getLPData(_, args) {
      return getLPData(args?.address);
    },

    getGovData() {
      return getGovData();
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
  path: '/api/anchor',
});
