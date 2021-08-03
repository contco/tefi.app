import { ApolloServer } from 'apollo-server-micro';
import { ApolloGateway } from '@apollo/gateway';

const SERVER_END_POINT = process.env.SERVER_ENDPOINT;

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'terra-core', url: `${SERVER_END_POINT}/terra-core`},
        { name: 'anchor', url: `${SERVER_END_POINT}/anchor` },
        { name: 'mirror', url: `${SERVER_END_POINT}/mirror` },
        { name: 'pylon', url: `${SERVER_END_POINT}/pylon`},
        { name: 'spectrum', url: `${SERVER_END_POINT}/spectrum` },
        { name: 'loterra', url: `${SERVER_END_POINT}/loterra` }
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