import { ApolloServer } from 'apollo-server-micro';
import { ApolloGateway } from '@apollo/gateway';

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'terra-core', url: 'https://tefi-app.vercel.app/api/terra-core' },
        { name: 'anchor', url: 'https://tefi-app.vercel.app/api/anchor' },
        { name: 'mirror', url: 'https://tefi-app.vercel.app/api/mirror' },
        { name: 'pylon', url: 'https://tefi-app.vercel.app/api/pylon' },
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