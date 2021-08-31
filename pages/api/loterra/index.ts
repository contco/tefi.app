import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getLoterraAccount } from './lib';

const typeDefs = gql`
  type SpecGov {
    name: String!
    symbol: String!
    staked: String!
    value: String!
    rewards: String!
    price: String!
    apr: String!
  }

  type LoterraDraw {
    combinations: String!
    drawTime: String!
    jackpot: String!
    ticketPrice: String!
    ticketCounts: String!
  }

  type LotaGov {
    name: String!
    symbol: String!
    staked: String!
    value: String!
    rewards: String!
    rewardsValue: String!
    apr: String!
    price: String!
  }

  type LoterraAccount {
    loterraDraw: LoterraDraw
    lotaGov: LotaGov
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    loterra: LoterraAccount
  }
`;

const resolvers = {
  Assets: {
    loterra(assets) {
      return getLoterraAccount(assets.address);
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
  path: '/api/loterra',
});
