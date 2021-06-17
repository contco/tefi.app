import { LCDClient, MnemonicKey, StdFee, Wallet } from '@terra-money/terra.js';
import {
  Anchor,
  tequila0004,
  columbus4,
  AddressProviderFromJson,
  OperationGasParameters,
} from '@anchor-protocol/anchor.js';
import { IS_TEST, TERRA_TEST_NET, TERRA_MAIN_NET } from '../../../../constants';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const MANTLE_ANCHOR_API = 'https://mantle.anchorprotocol.com/';
const addressProvider = new AddressProviderFromJson(IS_TEST ? tequila0004 : columbus4);

const lcd = new LCDClient(IS_TEST ? TERRA_TEST_NET : TERRA_MAIN_NET);
const key = new MnemonicKey({
  mnemonic:
    'immense pear text path unique have educate forum maple need carbon side hello remove strike drive legal december protect industry alley truly december brick',
});

export const ContractAddresses = {
  cw20: 'terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76',
  gov: 'terra1f32xyep306hhcxxxf7mlyh0ucggc00rm2s9da5',
  moneyMarket: 'terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s',
  staking: 'terra1897an2xux840p9lrh6py3ryankc6mspw49xse3',
  ancUstLP: 'terra1gecs98vcuktyfkrve9czrpgtg0m3aq586x6gzm',
};

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
