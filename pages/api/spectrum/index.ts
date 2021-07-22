import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getAccount } from "./lib";

const typeDefs = gql`

  type SpecHoldings {
      name: String!
      symbol: String!
      balance: String!
      value: String!
      price: String!
  }

  type SpecFarms {
    symbol: String!
    lpName: String!
    stakedLp: String!
    stakedLpUstValue: String!
    tokenStaked: String!
    ustStaked: String!
    farm: String!
    stakedSpec: String!
    stakedSpecValue: String!
    stakedMir: String!
    stakedMirValue: String!
    apy: String!
  }
  
  type SpecGov {
    name: String!
    staked: String!
    value: String!
    rewards: String!
    price: String!
    apr: String!
  }

  type SpectrumTotal {
    farmsTotal: String!
    holdingsTotal: String!
  }

  type SpectrumAccount {
    farms: [SpecFarms!]
    specHoldings: [SpecHoldings!]
    specGov: SpecGov
    spectrumTotal: SpectrumTotal
  }

  extend type Assets @key(fields: "address") {
    address: String! @external
    spectrum: SpectrumAccount
  }
`;

const resolvers = {
  Assets: {
    spectrum(assets) {
      return getAccount(assets.address);
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
  path: '/api/spectrum',
});
