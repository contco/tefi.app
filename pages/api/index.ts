import { ApolloServer, gql } from 'apollo-server-micro';
import { ApolloGateway } from '@apollo/gateway';

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'terra-core', url: 'http://localhost:3003/api/terra-core' },
        { name: 'anchor', url: 'http://localhost:3003/api/anchor' },
        { name: 'mirror', url: 'http://localhost:3003/api/mirror' },
    ],
});

const apolloServer = new ApolloServer({ gateway, subscriptions: false });

export const config = {
    api: {
        bodyParser: false,
    },
}

export default apolloServer.createHandler({
    path: '/api',
})