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


export const getTotalDesposit = async () => {
    const address = wallet.key.accAddress;
    const total = await anchor.earn.getTotalDeposit({ market: MARKET_DENOMS.UUSD, address });
    console.log('total', total);
}

export const getAPY = async () => {
    const address = wallet.key.accAddress;
    const apy = await anchor.earn.getAPY({ market: MARKET_DENOMS.UUSD });
    console.log('apy', apy);
}