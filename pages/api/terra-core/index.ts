import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getBankBalance } from './core';

const typeDefs = gql`
    type Coin {
        denom: String!
        amount: String!
        delegations: String
        undelegations: String
    }

    type Assets @key(fields: "address") {
        address: String!
        coins: [Coin]
    }

    type Query {
        assets(address: String!): Assets
    }
`;

const resolvers = {
    Query: {
        assets(parent, args, context) { return getBankBalance({ args }) },
    },
    Assets: {
        __resolveReference(assets) {
            return getBankBalance({ args: { address: assets.address } })
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
    path: '/api/terra-core',
})