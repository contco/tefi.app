import { ApolloServer, gql } from 'apollo-server-micro';
import { getBalance } from './core';

const typeDefs = gql`
    type Coin {
        denom: String
        amount: String
    }

    type Query {
        getBalance(address: String!): [Coin]
    }
`;

const resolvers = {
    Query: {
        getBalance(parent, args, context) { return getBalance({ args }) },
    },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
    api: {
        bodyParser: false,
    },
}

export default apolloServer.createHandler({
    path: '/api/terra-core',
})