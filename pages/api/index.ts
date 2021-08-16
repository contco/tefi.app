import { ApolloServer } from 'apollo-server-micro';
import { ApolloGateway } from '@apollo/gateway';

const SERVER_END_POINT = process.env.SERVER_ENDPOINT;

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'terra-core', url: `http://localhost:3003/api/terra-core` },
        { name: 'anchor', url: `http://localhost:3003/api/anchor` },
        { name: 'mirror', url: `http://localhost:3003/api/mirror` },
        { name: 'pylon', url: `http://localhost:3003/api/pylon` },
        { name: 'spectrum', url: `http://localhost:3003/api/spectrum` },
        { name: 'loterra', url: `http://localhost:3003/api/loterra` }
    ],
});

const apolloServer = new ApolloServer({ gateway, subscriptions: false, playground: true, introspection: true });

export const config = {
    api: {
        bodyParser: false,
    },
}

export default apolloServer.createHandler({
    path: '/api',
})