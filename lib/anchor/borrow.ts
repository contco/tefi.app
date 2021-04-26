import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import { anchor, gasParameters, wallet } from './test-defaults';

export const getBorrowLimit = async () => {
    const address = wallet.key.accAddress;
    const result = await anchor.borrow.getBorrowLimit({ market: MARKET_DENOMS.UUSD, address });
    console.log('result', result);
}

export const getBorrowedValue = async () => {
    const address = wallet.key.accAddress;
    const result = await anchor.borrow.getBorrowedValue({ market: MARKET_DENOMS.UUSD, address });
    console.log('result', result);
}

export const getCollaterals = async () => {
    const address = wallet.key.accAddress;
    const result = await anchor.borrow.getCollaterals({ market: MARKET_DENOMS.UUSD, address });
    console.log('result', result);
}