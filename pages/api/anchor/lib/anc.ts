import { anchor } from './test-defaults';
import getDebt from './borrow';
import getEarn from './earn';
import getPool from './lp';
import getGov from './gov';
import {getAirdrops} from "./airdrop";

export const getAccount = async (address: any) => {
  const balanceRequest =  anchor.anchorToken.getBalance(address);
  const priceRequest =  anchor.anchorToken.getANCPrice();

  const debtRequest =  getDebt(address);
  const earnRequest =  getEarn(address);
  const poolRequest =  getPool(address);
  const govRequest =  getGov();

  let anchorData = await Promise.all([balanceRequest, priceRequest, debtRequest, earnRequest, poolRequest, govRequest]);
  
  const [balance, price, debt, earn, pool, gov] = anchorData;
  const {airdrops, airdropSum} = await getAirdrops(address, price);

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
      value: debt.value,
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
    airdrops,
    total: {
      airdropSum
    }
  };

  return result;
};
