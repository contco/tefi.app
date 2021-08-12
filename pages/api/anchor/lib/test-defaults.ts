import { LCDClient, MnemonicKey, StdFee, Wallet } from '@terra-money/terra.js';
import {
  Anchor,
  tequila0004,
  columbus4,
  AddressProviderFromJson,
  OperationGasParameters,
} from '@anchor-protocol/anchor.js';
import { IS_TEST, TERRA_TEST_NET, TERRA_MAIN_NET } from '../../../../constants';

const addressProvider = new AddressProviderFromJson(IS_TEST ? tequila0004 : columbus4);

const lcd = new LCDClient(IS_TEST ? TERRA_TEST_NET : TERRA_MAIN_NET);
const key = new MnemonicKey({
  mnemonic:
    'immense pear text path unique have educate forum maple need carbon side hello remove strike drive legal december protect industry alley truly december brick',
});

export const blocksPerYear = 4656810;

export const ContractAddresses = {
  cw20: 'terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76',
  gov: 'terra1f32xyep306hhcxxxf7mlyh0ucggc00rm2s9da5',
  moneyMarket: 'terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s',
  staking: 'terra1897an2xux840p9lrh6py3ryankc6mspw49xse3',
  ancUstLP: 'terra1gecs98vcuktyfkrve9czrpgtg0m3aq586x6gzm',
  ancUstPair: 'terra1gm5p3ner9x9xpwugn9sp6gvhd0lwrtkyrecdn3',
  overseer: 'terra1tmnqgvg567ypvsvk6rwsga3srp7e3lg6u0elp8',
  interest: 'terra1kq8zzq5hufas9t0kjsjc62t2kucfnx8txf547n',
  airdrop: 'terra146ahqn6d3qgdvmj8cj96hh03dzmeedhsf0kxqm',
};

export const wallet = new Wallet(lcd, key);

export const anchor = new Anchor(lcd, addressProvider);

export const gasParameters: OperationGasParameters = {
  gasAdjustment: 1.4,
  gasPrices: '0.15uusd',
  fee: new StdFee(3_000_000, { uusd: 3_000_000 }),
};
