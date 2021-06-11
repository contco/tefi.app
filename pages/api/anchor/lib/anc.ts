import { anchor } from './test-defaults';
import getDebt from './borrow';
import getEarn from './earn';
import getPool from './lp';
import getGov from './gov';

export const getAccount = async (address: any) => {
  const balance = await anchor.anchorToken.getBalance(address);
  const price = await anchor.anchorToken.getANCPrice();

  const debt = await getDebt(address);
  const earn = await getEarn(address);
  const pool = await getPool(address);
  const gov = await getGov();

  const result = {
    assets: [
      {
        amount: balance.toString(),
        price: price.toString(),
        symbol: 'ANC',
      },
    ],

    debt: {
      reward: {
        name: debt.reward.name,
        apy: debt.reward.apy,
      },

      limit: debt.limit,
      collaterals: debt.collaterals,
    },

    earn: {
      reward: {
        name: earn.reward.name,
        apy: earn.reward.apy,
        staked: earn.reward.staked,
      },
    },

    pool: {
      reward: {
        name: pool.reward.name,
        apy: pool.reward.apy,
        staked: pool.reward.staked,
      },
      balance: pool.balance,
    },

    gov: {
      reward: {
        name: gov.reward.name,
        apy: gov.reward.apy,
      },
    },
  };

  return result;
};
