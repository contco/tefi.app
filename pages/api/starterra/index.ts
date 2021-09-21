import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import {getStarTerraAccount} from './lib/pools';

const typeDefs = gql`
  type StarStakedData {
    lpname: String!
		faction: String!
    stakedLp: String!
		stakedLpUstValue: String!
    token1Staked: String!
    token2Staked: String!
    rewards: String!
    rewardsValue: String!
  }

  type StarTerraAccount {
    stakedData: [StarStakedData]
		symbol1: String
		symbol2: String
    stakableLp: String
    token1UnStaked: String
    token2UnStaked: String
    totalStakedLp: String
    totalStakedLpUstValue: String
    totalRewards: String
    totalRewardsValue: String
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    starterra: StarTerraAccount
  }
`;

const resolvers = {
  Assets: {
    starterra(assets) {
      return getStarTerraAccount(assets.address);
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
  path: '/api/starterra',
});
