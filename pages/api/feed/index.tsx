import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getPost } from './getPost';

const typeDefs = gql`

  type Post {
      from_address: String!
      to_address: String!
      block: String!
      memo: String!
      txhash: String!
      timestamp:String!
  }
 type Posts {
     posts:[Post!]
 }
 
extend type Assets @key(fields: "address") {
    address: String! @external
    feed: Posts
  }
`;

const resolvers = {
    Assets: {
        feed(assets) {
          return getPost(assets.address);
        },
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
