import { anchor } from './test-defaults';
import getDebt from './borrow';
import getEarn from './earn';
import { getAncPoolData } from './lp';
import getGov from './gov';
import { formatAirdrops, getAirdrops } from './airdrop';

const fetchBalance = async (address: string) => {
  try {
    const balance = await anchor.anchorToken.getBalance(address);
    return balance;
  }
  catch (err) {
    return '0';
  }
}

const fetchPrice = async () => {
  try {
    const price = anchor.anchorToken.getANCPrice();
    return price;
  }
  catch (err) {
    return '0';
  }
}

const getAnchorHoldings = (balance: number, price: number) => {
  if (balance) {
    const value = (balance * price).toString();
    const anchorHoldings = [
      { symbol: 'ANC', name: 'Anchor', balance: balance.toString(), value, price: price.toString() },
    ];
    return { anchorHoldings, anchorHoldingsSum: value };
  }
  return { anchorHoldings: [], anchorHoldingsSum: '0' };
};

export const getAccount = async (address: any) => {
  const balanceRequest = fetchBalance(address);
  const priceRequest = fetchPrice();
  const debtRequest = getDebt(address);
  const earnRequest = getEarn(address);
  const poolRequest = getAncPoolData(address);
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

  const { poolData, anchorPoolSum, anchorRewardsSum } = pool;

  const { anchorHoldings, anchorHoldingsSum } = getAnchorHoldings(parseFloat(balance), parseFloat(price));

  let reward = 0;

  if (debt.reward.reward === '<0.001') {
    reward = parseFloat(anchorRewardsSum);
  } else {
    reward = parseFloat(debt.reward.reward) + parseFloat(anchorRewardsSum);
  }

  const rewardValue = reward * parseFloat(price);

  const result = {
    assets: anchorHoldings,
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
      lunaprice: debt.lunaprice,
      ancprice: debt.ancprice,
      netApy: debt.netApy,
    },

    earn: {
      reward: {
        name: earn.reward.name,
        apy: earn.reward.apy,
        staked: earn.reward.staked,
      },
    },

    pool: poolData,

    gov: gov,
    airdrops,
    total: {
      airdropSum,
      anchorRewardsSum,
      anchorPoolSum,
      anchorHoldingsSum,
    },
    totalReward: rewardValue.toString(),
  };

  return result;
};
