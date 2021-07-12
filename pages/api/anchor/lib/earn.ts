import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { anchor } from './test-defaults';
import { formatRate } from '@anchor-protocol/notation';

export const getTotalDesposit = async ({ address }: any) => {
  const totalDesposit = await anchor.earn.getTotalDeposit({ market: MARKET_DENOMS.UUSD, address });
  return totalDesposit;
};

export const getAPY = async () => {
  const apy = await anchor.earn.getAPY({ market: MARKET_DENOMS.UUSD });
  return apy;
};

export default async (address) => {
  const totalDesposit = await getTotalDesposit({ address });
  const apy = await getAPY();

  const result = {
    reward: {
      name: 'ANC Earn',
      apy: formatRate(apy),
      staked: totalDesposit,
    },
  };
  return result;
};
