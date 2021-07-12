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
    apy: String!
}

  type PylonAirdrops {
    price: String!
    quantity: String!
    name: String!
    symbol: String!
  }

  type PylonSum {
      pylonHoldingsSum: String!
      pylonStakingSum: String!
      pylonPoolSum: String!
      pylonAirdropSum: String!
      pylonPoolRewardsSum: String!
      pylonStakingRewardsSum: String!
      gatewayRewardsSum: String!
      gatewayDepositsSum: String!
  }

  type DepositLogs {
    deposit: String!
    depositDate: String!
    depositReleaseDate: String!
    rewardReleaseDate: String!
  }
  
  type PylonGateway {
    symbol: String!
    poolName: String!
    totalDeposit: String!
    depositLogs: [DepositLogs!]
    apy: String!
    rewards: String!
    rewardsValue: String!
  }

  type PylonAccount {
    pylonHoldings: [PylonHoldings!]
    pylonStakings: [PylonStaking!]
    pylonPool: [PylonPool!]
    pylonAirdrops: PylonAirdrops
    pylonSum: PylonSum
    pylonGateway: [PylonGateway!]

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