import axios from 'axios';
import BigNumber from 'bignumber.js';
import { CLUB_SERVER_ROOT } from '../constants';
import { Coin } from '@terra-money/terra.js';

const DEFAULT_DENOM = 'uusd';
const TREASURY_URL = CLUB_SERVER_ROOT + '/treasury';

const fetchCapital = async (denom = DEFAULT_DENOM) => {
  const { data } = await axios.get(TREASURY_URL + `/tax_caps/${denom}`);
  const taxCap = data?.tax_cap;
  return taxCap;
};

export const calculateTax = async (amount: string, denom = DEFAULT_DENOM) => {
  const { data: taxRateResult } = await axios.get(TREASURY_URL + '/tax_rate');
  const taxRate = taxRateResult?.tax_rate ?? '0';
  const taxCap = denom === 'uluna' ? '0' : await fetchCapital(denom);
  const taxAmount = BigNumber.min(new BigNumber(amount).times(taxRate), new BigNumber(taxCap))
    .integerValue(BigNumber.ROUND_CEIL)
    .toString();
  return new Coin(denom, taxAmount);
};
