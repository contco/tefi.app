import { LCDClient, MnemonicKey, StdFee, Wallet } from '@terra-money/terra.js';
import { Anchor, tequila0004, AddressProviderFromJson, OperationGasParameters } from '@anchor-protocol/anchor.js';
import { IS_TEST, TERRA_TEST_NET, TERRA_MAIN_NET } from '../../../../constants';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const MANTLE_ANCHOR_API = 'https://mantle.anchorprotocol.com/';

const addressProvider = new AddressProviderFromJson(tequila0004);

const lcd = new LCDClient(IS_TEST ? TERRA_TEST_NET : TERRA_MAIN_NET);
const key = new MnemonicKey({
  mnemonic:
    'immense pear text path unique have educate forum maple need carbon side hello remove strike drive legal december protect industry alley truly december brick',
});

export const client = new ApolloClient({
  uri: MANTLE_ANCHOR_API,
  cache: new InMemoryCache(),
});

export const wallet = new Wallet(lcd, key);

export const anchor = new Anchor(lcd, addressProvider);

export const gasParameters: OperationGasParameters = {
  gasAdjustment: 1.4,
  gasPrices: '0.15uusd',
  fee: new StdFee(3_000_000, { uusd: 3_000_000 }),
};
