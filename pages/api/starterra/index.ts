import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import {getStarTerraAccount} from './lib/account';

const typeDefs = gql`
  type StarStakedData {
    lpName: String!
		faction: String!
    stakedLp: String!
		stakedLpUstValue: String!
    token1Staked: String!
    token2Staked: String!
    rewards: String!
    rewardsValue: String!
		unbondedLp: String
		unbondingTime: String
		unbondedLpUstValue: String
  }
  

  type StarTerraPools {
    stakedData: [StarStakedData]
		symbol1: String
		symbol2: String
    stakeableLp: String
    stakeableLpUstValue: String
    token1UnStaked: String
    token2UnStaked: String
    totalStakedLp: String
    totalStakedLpUstValue: String
    totalRewards: String
    totalRewardsValue: String
  }

  type StarTerraGov {
    name: String
    symbol: String
    faction: String
    staked: String
    value: String
    rewards: String
    rewardsValue: String
    apr: String

  }

  type StarTerraAccount {
    starTerraPools: StarTerraPools
    starTerraGov: StarTerraGov
    govRewardsTotal: String
    govStakedTotal: String
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
