import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getTokenBalance } from './getTokenBalance';
import { getPoolData } from './getPoolData';

const typeDefs = gql`
    type Token {
        symbol: String!
        amount: String!
        price: String!
        staked: String
    }

    type Pool {
        symbol1: String!
        symbol2: String!
        balance1: String!
        balance2: String!
        balanceValue: String!
        rewards: String!
        rewardsValue: String!
        poolTotal: String!
    }

    extend type Assets @key(fields: "address") {
        address: String! @external
        mirror: [Token]
    }

    type Query {
        pools(address: String!): Pool
    }
`;

const resolvers = {
    Query: {
        pools(_, args) { console.log(args); return getPoolData(args?.address) },
    },
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