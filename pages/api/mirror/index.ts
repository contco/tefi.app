import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getTokenBalance } from './getTokenBalance';

const typeDefs = gql`
    type Token {
        symbol: String!
        amount: String!
        price: String!
        staked: String
    }

    extend type Assets @key(fields: "address") {
        address: String! @external
        mirror: [Token]
    }
`;

const resolvers = {
    Assets: {
        mirror(assets) {
            return getTokenBalance(assets.address);
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
    path: '/api/mirror',
})