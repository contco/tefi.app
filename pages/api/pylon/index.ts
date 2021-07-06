import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getAccountData } from "./getAccountData";

const typeDefs = gql`

  type PylonHoldings {
      name: String!
      symbol: String!
      balance: String!
      value: String!
      price: String!
  }

  type PylonStaking {
      name: String!
      symbol: String!
      balance: String!
      rewards: String!
      stakedValue: String! 
      rewardsValue: String!
      totalValue: String!
      apy: String!
  }

  type PylonPool {
    symbol: String!
    availableLP: String!
    stakedLP: String!
    rewards: String!
    rewardsValue: String!
    apy: String!
}

  type PylonAirdrops {
    price: String!
    quantity: String!
    name: String!
  }

  type PylonSum {
      pylonHoldingsSum: String!
      pylonStakingSum: String!
      pylonPoolSum: String!
      pylonAirdropSum: String!
  }

  type PylonAccount {
    pylonHoldings: [PylonHoldings!]
    pylonStakings: [PylonStaking!]
    pylonPool: [PylonPool!]
    pylonAirdrops: PylonAirdrops
    pylonPoolSum: PylonSum

  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    pylon: PylonAccount
  }
`;

const resolvers = {
  Assets: {
    pylon(assets) {
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
  path: '/api/pylon',
});
