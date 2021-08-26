import {NextApiRequest, NextApiResponse} from 'next';
import { ApolloServer } from 'apollo-server-micro';
import { ApolloGateway } from '@apollo/gateway';
import {cors, runMiddleware} from './lib';





const SERVER_END_POINT = process.env.SERVER_ENDPOINT;

const gateway = new ApolloGateway({
    serviceList: [
        { name: 'terra-core', url: `${SERVER_END_POINT}/terra-core` },
        { name: 'anchor', url: `${SERVER_END_POINT}/anchor` },
        { name: 'mirror', url: `${SERVER_END_POINT}/mirror` },
        { name: 'pylon', url: `${SERVER_END_POINT}/pylon` },
        { name: 'spectrum', url: `${SERVER_END_POINT}/spectrum` },
        { name: 'loterra', url: `${SERVER_END_POINT}/loterra` },
        { name: 'feed', url: `${SERVER_END_POINT}/feed` }
    ],
});

const apolloServer = new ApolloServer({ gateway, subscriptions: false, playground: true, introspection: true});

export const config = {
    api: {
        bodyParser: false,
    },

}

async function handler(req: NextApiRequest, res: NextApiResponse) {

    await runMiddleware(req, res, cors);

    return apolloServer.createHandler({
        path: '/api',
    })(req,res);

}
  
export default handler;
