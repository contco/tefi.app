import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import getAccount from './lib/pools';

const typeDefs = gql`
  type StarStakedData {
    name: String
    stakedLP: String
    sttStaked: String
    ustStaked: String
    reward: String
  }

  type StarTerraAccount {
    stakedData: [StarStakedData]
    stakableLP: String
    sttStakable: String
    ustStakable: String
    totalStakedLP: String
    totalStakedLPValue: String
    totalReward: String
    totalRewardValue: String
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    starterra: StarTerraAccount
  }
`;

const resolvers = {
  Assets: {
    starterra(assets) {
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
  path: '/api/starterra',
});
