import { NextApiRequest, NextApiResponse } from 'next';
import { ApolloServer } from 'apollo-server-micro';
import { cors, runMiddleware } from './lib';

const apolloServer = new ApolloServer({ subscriptions: false, playground: true, introspection: true });

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  return apolloServer.createHandler({
    path: '/api',
  })(req, res);
}

export default handler;
