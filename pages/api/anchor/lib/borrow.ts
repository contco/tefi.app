import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import { anchor } from './test-defaults';

export const getBorrowLimit = async ({ address }: any) => {
    const result = await anchor.borrow.getBorrowLimit({ market: MARKET_DENOMS.UUSD, address });
    console.log('result', result);
    return result;
}

export const getBorrowedValue = async ({ address }: any) => {
    const result = await anchor.borrow.getBorrowedValue({ market: MARKET_DENOMS.UUSD, address });
    console.log('result', result);
    return result;
}

export const getCollaterals = async ({ address }: any) => {
    const result = await anchor.borrow.getCollaterals({ market: MARKET_DENOMS.UUSD, address });
    console.log('result', result);
    return result;
}


export default async ({ args: { address } }: any) => {
    const borrowLimit = await getBorrowLimit({ address });
    const borrowedValue = await getBorrowedValue({ address });
    const collaterals = await getCollaterals({ address });
    return { borrowLimit, borrowedValue, collaterals }
}