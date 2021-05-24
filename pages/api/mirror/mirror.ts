import { LCDClient } from '@terra-money/terra.js';
import { Mirror, DEFAULT_MIRROR_OPTIONS } from '@mirror-protocol/mirror.js';
import { gql } from '@apollo/client';
import { IS_TEST, TERRA_TEST_NET, TERRA_MAIN_NET } from '../../../constants';

const MIRROR_API = 'https://graph.mirror.finance/graphql';

const MIR_TOKEN_ADD = "terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6";

const lcd = new LCDClient(IS_TEST ? TERRA_TEST_NET : TERRA_MAIN_NET);
// need values for test env to work
const mirror = new Mirror();

import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://graph.mirror.finance/graphql',
    cache: new InMemoryCache()
});

export const getMirrorAssets = async (address: string) => {
    const stakingBalance = await mirror.gov.getStaker(address);
    const result = await client
        .query({
            query: gql`
                query Balance {
                balances(address: "terra14lsth0ernuvvleesun5rehf46s8q3k5u5knnkk"){
                    balance
                    token
                    averagePrice
                }
            }
    `});
    const balance = result.data.balances.map((item) => {
        const token = {
            price: item.averagePrice,
            amount: item.balance,
            symbol: item.token,
            staked: null,
        };
        if (item.token == MIR_TOKEN_ADD) {
            token.staked = stakingBalance.balance
        }
        return token;
    });
    return balance
};