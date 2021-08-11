import { ApolloServer, gql } from 'apollo-server-micro';
import { buildFederatedSchema } from '@apollo/federation';
import { getBankBalance } from './core';
import { saveAddress } from '../commons/knownAddress';

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
       unstakedSum: String
   }
   
   type LunaStaking {
       balance: String
       rewards: String
       stakedValue: String
       rewardsValue: String
       totalValue: String
       validator: String
       state: String
   }

    type Core {
        coins: [Coin]
        staking: [LunaStaking]
        total: CoreTotal
    }

    type PoolTokens {
        symbol1: String!
        symbol2:String!
        lpName: String!
        price: String!
        stakedLp: String!
        stakedLpUstValue:String!
        stakeableLp: String!
        stakeableLpUstValue:String!
        token1UnStaked:String!
        token1Staked:String!
        token2UnStaked:String!
        token2Staked:String!
        totalLpUstValue:String!
    }

    type Pool {
        list:[PoolTokens!]
        total:String
    }

    type Assets @key(fields: "address") {
        address: String!
        core: Core
        holdings: Coin
        terraSwapPool: Pool
    }
    
    type Query {
        assets(address: String!): Assets
    }
`;

const resolvers = {
    Query: {
        async assets(_, args) {
            saveAddress(args.address);
            return getBankBalance({ args })
        },
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