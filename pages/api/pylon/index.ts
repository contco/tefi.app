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

  type PylonGov {
      name: String!
      symbol: String!
      staked: String!
      rewards: String!
      value: String! 
      price: String!
      rewardsValue: String!
      totalValue: String!
      apy: String!
  }

  type PylonPool {
    symbol1: String!
    symbol2: String!
    lpName: String!
    token1UnStaked:String!
    token2UnStaked:String!
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

  type PylonAirdrops {
    value: String!
    quantity: String!
    name: String!
    symbol: String!
    round: Int!
    proof: [String!]
    contract: String!
  }

  type PylonSum {
      pylonHoldingsSum: String!
      pylonPoolSum: String!
      pylonAirdropSum: String!
      pylonPoolRewardsSum: String!
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
    gov: PylonGov
    pylonPool: [PylonPool!]
    pylonAirdrops: [PylonAirdrops]
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
