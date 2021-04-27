import { LCDClient, MnemonicKey, StdFee, Wallet } from '@terra-money/terra.js'
import { Anchor, tequila0004, AddressProviderFromJson, OperationGasParameters } from '@anchor-protocol/anchor.js'

const addressProvider = new AddressProviderFromJson(tequila0004)
const lcd = new LCDClient({ URL: 'https://tequila-lcd.terra.dev', chainID: 'tequila-0004' })
const key = new MnemonicKey({
    mnemonic:
        'immense pear text path unique have educate forum maple need carbon side hello remove strike drive legal december protect industry alley truly december brick',
});

export const wallet = new Wallet(lcd, key)

export const anchor = new Anchor(lcd, addressProvider)

export const gasParameters: OperationGasParameters = {
    gasAdjustment: 1.4,
    gasPrices: "0.15uusd",
    fee: new StdFee(3_000_000, { uusd: 3_000_000 })
}
