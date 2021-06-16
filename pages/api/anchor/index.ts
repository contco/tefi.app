import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getAccount } from './lib/anc';

const typeDefs = gql`
  type Token {
    symbol: String!
    amount: String!
    price: String!
    staked: String
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
    value: String
    collaterals: [UserCollateral]!
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

  type AccountANC {
    assets: [Token]
    debt: BorrowData
    earn: EarnData
    pool: LPData
    gov: GovData
    rewarding: String
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    anchor: AccountANC
  }
`;

const resolvers = {
  Assets: {
    anchor(assets) {
      return getAccount(assets.address);
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
