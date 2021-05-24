import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getBalance } from './lib/anc';

const typeDefs = gql`
    type Token {
        symbol: String!
        amount: String!
        price: String!
        staked: String
    }

    extend type Assets @key(fields: "address") {
        address: String! @external
        anchor: [Token]
    }
`;

const resolvers = {
  Assets: {
    anchor(assets) {
      return getBalance(assets.address);
    }
  }
};

const apolloServer = new ApolloServer({ schema: buildFederatedSchema([{ typeDefs, resolvers }]) });

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({
  path: '/api/anchor',
})