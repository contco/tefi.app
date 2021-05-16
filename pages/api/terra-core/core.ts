import { LCDClient, Coin } from '@terra-money/terra.js';
import { IS_TEST, TERRA_TEST_NET, TERRA_MAIN_NET } from '../../../constants';

const LUNA_DENOM = 'uluna';

const terra = new LCDClient(IS_TEST ? TERRA_TEST_NET : TERRA_MAIN_NET);

export const getDeledatedBalance = async (address: string) => {
    const balance = await terra.staking.delegations(address);
    let total = 0;
    balance.map((item) => {
        total += Number(item.balance.amount);
        return item.balance;
    });
    return total;
}

export const getUndeledatedBalance = async (address: string) => {
    const balance = await terra.staking.unbondingDelegations(address);
    const filteredBalance = balance.map((item) => item.entries.map((entry) => entry.balance));
    let total = 0;
    filteredBalance.map((item) => {
        item.map((i) => {
            total += Number(i);
        })
    })
    return total;
}

export const getBankBalance = async ({ args: { address } }: any) => {
    const balance = await terra.bank.balance(address);
    const coins = balance.toData();
    const delegations = await getDeledatedBalance(address);
    const unDelegations = await getUndeledatedBalance(address);
    const combined = combineBalance({ coins, delegations, unDelegations });
    return { address, coins: combined };
}

const combineBalance = ({ coins, delegations, unDelegations }: any) => {
    if (delegations || unDelegations) {
        return coins.map((coin) => {
            if (coin.denom == LUNA_DENOM) {
                return {
                    ...coin,
                    delegations: delegations.toString(),
                    undelegations: unDelegations.toString(),
                }
            }
            return coin;
        })
    }
    return coins;
}