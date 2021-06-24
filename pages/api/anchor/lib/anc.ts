import { anchor } from './test-defaults';
import getDebt from './borrow';
import getEarn from './earn';
import getPool from './lp';
import getGov from './gov';
import { formatAirdrops, getAirdrops } from './airdrop';

export const getAccount = async (address: any) => {
  const balanceRequest = anchor.anchorToken.getBalance(address);
  const priceRequest = anchor.anchorToken.getANCPrice();

  const debtRequest = getDebt(address);
  const earnRequest = getEarn(address);
  const poolRequest = getPool(address);
  const govRequest = getGov(address);
  const airdropRequest = getAirdrops(address);

  const anchorData = await Promise.all([
    balanceRequest,
    priceRequest,
    debtRequest,
    earnRequest,
    poolRequest,
    govRequest,
    airdropRequest,
  ]);

  const [balance, price, debt, earn, pool, gov, airdropData] = anchorData;
  const { airdrops, airdropSum } = formatAirdrops(airdropData, price);

  const reward = parseFloat(debt.reward.reward) + parseFloat(pool.reward.reward);
  const rewardValue = reward * parseFloat(price);

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
        reward: debt.reward.reward,
      },

      limit: debt.limit,
      collaterals: debt.collaterals,
      value: debt.value,
      percentage: debt.percentage,
      price: debt.price,
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
        reward: pool.reward.reward,
      },
      balance: pool.balance,
      anc: pool.anc,
      ust: pool.ust,
      value: pool.value,
    },

    gov: {
      reward: {
        name: gov.reward.name,
        apy: gov.reward.apy,
        staked: gov.reward.staked,
      },
    },
    airdrops,
    total: {
      airdropSum,
    },
    totalReward: rewardValue.toString(),
  };

  return result;
};
