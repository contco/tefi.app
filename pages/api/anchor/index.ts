import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import getBorrowData from './lib/borrow';
import getEarnData from './lib/earn';
import getLPData from './lib/lp';
import getGovData from './lib/gov';

const typeDefs = gql`
  type UserCollateral {
    collateral: String!
    balance: String!
  }

  type BorrowData {
    borrowLimit: String!
    borrowedValue: String!
    collaterals: [UserCollateral]!
    borrowAPY: String!
  }

  type EarnData {
    totalDesposit: String!
    apy: String!
  }

  type LPData {
    balance: String!
    staked: String!
    lpAPY: String!
  }

  type GovData {
    govApy: String!
  }

  type Query {
    getBorrowData(address: String): BorrowData
    getEarnData(address: String!): EarnData
    getLPData(address: String!): LPData
    getGovData(address: String): GovData
  }
`;

const resolvers = {
  Query: {
    getBorrowData(parent, args, context) {
      return getBorrowData({ args });
    },
    getEarnData(parent, args, context) {
      return getEarnData({ args });
    },
    getLPData(parent, args, context) {
      return getLPData({ args });
    },

    getGovData(parent, args, context) {
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
