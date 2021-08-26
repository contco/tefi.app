import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getPost } from './getPost';

const typeDefs = gql`

  type post {
      from_address: String!
      to_address: String!
      block: String!
      memo: String!
      txhash: String!
      timestamp:String!
  }
 type feed {
     posts:[posts!]
 }
  type Query {
        feed(): feed
    }
`;

const resolvers = {
  Feed: {
    feed() {
      return getPost();
    }
  },

};

const apolloServer = new ApolloServer({ schema: buildFederatedSchema([{ typeDefs, resolvers }]) });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({
  path: '/api/feed',
});
