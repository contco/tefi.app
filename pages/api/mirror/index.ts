import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getAccountData } from './getAccountData';

const typeDefs = gql`
  type MirrorStaking {
    symbol1: String!
    symbol2: String!
    lpName: String!
    token1UnStaked:String!
    token2Unstaked:String!
    token1Staked:String!
    token2Staked:String!
    stakedLp: String!
    stakedLpUstValue: String!
    stakeableLp:String!
    stakeableLpUstValue:String!
    totalLpUstValue:String!
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

  type MirrorGov {
    name: String!
    symbol: String!
    staked: String!
    value: String!
    rewards: String!
    price: String!
    apr: String!
  }

  type Account {
    mirrorStaking: [MirrorStaking!]
    mirrorHoldings: [MirrorHoldings!]
    gov: MirrorGov
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
