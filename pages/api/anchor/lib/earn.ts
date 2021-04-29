import { MARKET_DENOMS } from '@anchor-protocol/anchor.js'
import { anchor, gasParameters, wallet } from './test-defaults';

export const desposit = async () => {
    const result = await anchor.earn.depositStable({ market: MARKET_DENOMS.UUSD, amount: "100.5000" }).execute(wallet, gasParameters);
    console.log('result', result);
}

export const withdraw = async () => {
    const result = await anchor.earn.withdrawStable({ market: MARKET_DENOMS.UUSD, amount: "100.5000" }).execute(wallet, gasParameters);
    console.log('result', result);
}


export const getTotalDesposit = async ({ address }: any) => {
    const totalDesposit = await anchor.earn.getTotalDeposit({ market: MARKET_DENOMS.UUSD, address });
    console.log('total', totalDesposit);
    return totalDesposit;
}

export const getAPY = async () => {
    const apy = await anchor.earn.getAPY({ market: MARKET_DENOMS.UUSD });
    console.log('apy', apy);
    return apy;
}

export default async ({ args: { address } }: any) => {
    const totalDesposit = await getTotalDesposit({ address });
    const apy = await getAPY();
    return { totalDesposit, apy }
}