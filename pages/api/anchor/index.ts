import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getAccount } from './lib/anc';

const typeDefs = gql`
  type Coin {
    name: String!
    symbol: String!
    balance: String
    value: String
    price: String
  }
  type Reward {
    name: String
    staked: String
    apy: String
    reward: String
  }

  type Airdrops {
    price: String
    quantity: String
    round: Int
    name: String
  }

  type UserCollateral {
    collateral: String
    balance: String
  }

  type BorrowData {
    reward: Reward
    limit: String!
    value: String
    collaterals: [UserCollateral]
    percentage: String
    price: String
  }

  type EarnData {
    reward: Reward
  }

  type LPData {
    reward: Reward!
    balance: String!
    stakedValue: String
    stakableValue: String
    anc: String
    ust: String
  }

  type GovData {
    reward: Reward!
  }

  type Total {
    airdropSum: String!
  }

  type AccountANC {
    assets: Coin
    debt: BorrowData
    earn: EarnData
    pool: LPData
    gov: GovData
    airdrops: [Airdrops!]
    total: Total
    totalReward: String
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
