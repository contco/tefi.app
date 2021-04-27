import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import getBorrowData from './lib/borrow';
import getEarnData from './lib/earn';

const typeDefs = gql`
  type UserCollateral {
    collateral: String!
    balance: String!
  }

  type BorrowData {
    borrowLimit: String!
    borrowedValue: String!
    collaterals: [UserCollateral]!
  }

  type EarnData {
    totalDesposit: String!
    apy: String!
  }

  type Query {
    getBorrowData(address: String!): BorrowData
    getEarnData(address: String!): EarnData
  }
`;

const resolvers = {
  Query: {
    getBorrowData(parent, args, context) { return getBorrowData({ args }) },
    getEarnData(parent, args, context) { return getEarnData({ args }) },
  },
};

const apolloServer = new ApolloServer({ schema: buildFederatedSchema([{ typeDefs, resolvers }]) });

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({
  path: '/api/anchor',
})