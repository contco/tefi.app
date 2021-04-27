import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getBankBalance } from './core';

const typeDefs = gql`
    type Coin {
        denom: String
        amount: String
    }

    type Query {
        getBankBalance(address: String!): [Coin]
    }
`;

const resolvers = {
    Query: {
        getBankBalance(parent, args, context) { return getBankBalance({ args }) },
    },
};

const apolloServer = new ApolloServer({ schema: buildFederatedSchema([{ typeDefs, resolvers }]) });

export const config = {
    api: {
        bodyParser: false,
    },
}

export default apolloServer.createHandler({
    path: '/api/terra-core',
})