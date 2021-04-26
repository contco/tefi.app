import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import { anchor, gasParameters, wallet } from './test-defaults';

export const getBalance = async () => {
    const address = wallet.key.accAddress;
    const result = await anchor.anchorToken.getBalance(address);
    console.log('result', result);
}