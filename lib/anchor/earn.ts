import { LCDClient, MnemonicKey, StdFee, Wallet } from '@terra-money/terra.js'
import { Anchor, tequila0004, AddressProviderFromJson, MARKET_DENOMS, OperationGasParameters, EarnDepositStableOption } from '@anchor-protocol/anchor.js'

const addressProvider = new AddressProviderFromJson(tequila0004)
const lcd = new LCDClient({ URL: 'https://tequila-lcd.terra.dev', chainID: 'tequila-0004' })
const key = new MnemonicKey({
    mnemonic:
        'immense pear text path unique have educate forum maple need carbon side hello remove strike drive legal december protect industry alley truly december brick',
});
const wallet = new Wallet(lcd, key)
const anchor = new Anchor(lcd, addressProvider)

const gasParameters: OperationGasParameters = {
    gasAdjustment: 1.4,
    gasPrices: "0.15uusd",
    fee: new StdFee(3_000_000, { uusd: 3_000_000 })
}


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
