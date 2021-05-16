import { LCDClient, Coin } from '@terra-money/terra.js';
import { IS_TEST, TERRA_TEST_NET, TERRA_MAIN_NET } from '../../../constants';

const terra = new LCDClient(IS_TEST ? TERRA_TEST_NET : TERRA_MAIN_NET);

export const getBankBalance = async ({ args: { address } }: any) => {
    const balance = await terra.bank.balance(address);
    const coins = balance.toData();
    return { address, tokens: coins };
}