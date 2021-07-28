import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getBankBalance } from './core';

const typeDefs = gql`
    type Coin {
        name: String!
        symbol: String!
        balance: String
        value: String
        price: String
    }

   type CoreTotal {
       assetsSum: String
       stakedSum: String
   }
   
   type LunaStaking {
       balance: String
       rewards: String
       stakedValue: String
       rewardsValue: String
       totalValue: String
       validator: String
   }

    type Core {
        coins: [Coin]
        staking: [LunaStaking]
        total: CoreTotal
    }

    type PoolTokens {
        price: String
        stakeableLP: String
        stakeableLpUstValue: String
        symbol: String
        token: String
        ust: String  
    }

    type Pool {
        list:[PoolTokens]
        totalValue:String
    }

    type Assets @key(fields: "address") {
        address: String!
        core: Core
        holdings: Coin
        pools: Pool
    }
    
    type Query {
        assets(address: String!): Assets
    }
`;

const resolvers = {
    Query: {
        assets(_, args) { return getBankBalance({ args }) },
    },
    Assets: {
        __resolveReference(assets) {
            return getBankBalance({ args: { address: assets.address } })
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
    path: '/api/terra-core',
})