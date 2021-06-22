import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getBankBalance } from './core';

const typeDefs = gql`
    type Coin {
        name: String!
        symbol: String!
        amount: String
        balance: String
        price: String
    }

   type CoreTotal {
       assetsSum: String
   }

    type Core {
        coins: [Coin]
        total: CoreTotal
    }

    type Assets @key(fields: "address") {
        address: String!
        core: Core
    }

    type Query {
        assets(address: String!): Assets
    }
`;

const resolvers = {
    Query: {
        assets(_, args) { return getBankBalance({ args }) },
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