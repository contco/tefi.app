import { LCDClient } from '@terra-money/terra.js';
import axios from 'axios';
import { IS_TEST, TERRA_TEST_NET, TERRA_MAIN_NET } from '../../../constants';
import { fetchTerraSwapHoldings } from './terraSwapHoldings';
import { plus, times, div } from '../mirror/utils';
import { UUSD_DENOM, LUNA_DENOM, DENOM_SYMBOLS } from './symbols';
import { getTerraSwapPoolData } from './terraSwapPools';
import { fetchData } from '../commons';

const DIVIDER = '1000000';
const FCD_URL = 'https://fcd.terra.dev/v1/';
const terra = new LCDClient(IS_TEST ? TERRA_TEST_NET : TERRA_MAIN_NET);

export const getPrice = async (denom: string) => {
  try {
    const priceList = await axios.get(FCD_URL + `market/swaprate/${denom}`);
    const ussdPrice = priceList?.data.find((price) => price.denom === UUSD_DENOM);
    return ussdPrice.swaprate;
  } catch (err) {
    return '0';
  }
};

const getTerraTokens = async (coins, price: string) => {
  let assetsSum = '0';
  const tokens = [];
  if (coins) {
    for (const coin of coins) {
      const balance = div(coin.amount, DIVIDER);
      if (coin.denom === UUSD_DENOM) {
        assetsSum = plus(assetsSum, balance);
        tokens.push({ ...DENOM_SYMBOLS[coin.denom], denom: coin.denom, price: '1', balance, value: balance });
      } else if (coin.denom === LUNA_DENOM) {
        const value = times(balance, price);
        assetsSum = plus(assetsSum, value);
        tokens.push({ ...DENOM_SYMBOLS[coin.denom], denom: coin.denom, price, balance, value });
      } else if (DENOM_SYMBOLS[coin.denom]) {
        const price = await getPrice(coin.denom);
        const value = times(balance, price);
        assetsSum = plus(assetsSum, value);
        tokens.push({ ...DENOM_SYMBOLS[coin.denom], denom: coin.denom, price: price, balance, value });
      }
    }
  }
  return { tokens, assetsSum };
};

const calculateStakeData = (delegations, price, state) => {
  return delegations.map((data: any) => {
    const balance = state === 'Delegated' ? div(data?.amountDelegated, DIVIDER) : div(data?.amount, DIVIDER);
    const rewards = div(data?.totalReward, DIVIDER);
    const stakedValue = times(balance, price);
    const rewardsValue = times(rewards, price);
    const totalValue = plus(stakedValue, rewardsValue);

    return {
      balance,
      rewards,
      stakedValue,
      rewardsValue,
      totalValue,
      validator: data?.validatorName,
      state: state,
    };
  });
};

const totalValueSum = (delegatedArray) => {
  const total = delegatedArray.reduce((a, asset) => a + parseFloat(asset?.totalValue), 0);
  return total.toString();
};

const formatStakeData = (stakeData: any, price: string) => {
  let stakedSum = '0';
  let unstakedSum = '0';
  if (stakeData && stakeData?.myDelegations && stakeData?.undelegations && stakeData?.redelegations) {
    const staking = calculateStakeData(stakeData.myDelegations, price, 'Delegated');
    const undelegated = calculateStakeData(stakeData.undelegations, price, 'Undelegated');
    const redelegated = calculateStakeData(stakeData.redelegations, price, 'Redelegated');

    stakedSum = plus(stakedSum, totalValueSum(staking));
    unstakedSum = plus(unstakedSum, totalValueSum(undelegated));
    stakedSum = plus(stakedSum, totalValueSum(redelegated));

    const allData = [...staking, ...undelegated, ...redelegated];

    return { allData, stakedSum, unstakedSum };
  } else return { allData: [], stakedSum, unstakedSum };
};

const fetchBalance = async (address: string) => {
  try {
    const balance = await terra.bank.balance(address);
    return balance;
  } catch (err) {
    return null;
  }
};

export const getBankBalance = async ({ args: { address } }: any) => {
  const balanceRequest = fetchBalance(address);
  const pricesRequest = fetchData(FCD_URL + 'dashboard');
  const stakingRequest = fetchData(FCD_URL + `staking/${address}`);
  const poolRequest = getTerraSwapPoolData(address);

  const [balance, pricesData, stakeData, terraSwapPool] = await Promise.all([
    balanceRequest,
    pricesRequest,
    stakingRequest,
    poolRequest,
  ]);
  const coins = balance ? balance.toData() : null;
  const lunaPrice = pricesData ? pricesData?.data?.prices[UUSD_DENOM] : '0';
  const getTerraRequest = getTerraTokens(coins, lunaPrice);
  const terraSwapHoldingsRequest: any = fetchTerraSwapHoldings(address, lunaPrice);
  const [terraTokens, terraSwapHoldingsData] = await Promise.all([getTerraRequest, terraSwapHoldingsRequest]);
  const { tokens, assetsSum } = terraTokens;
  const { terraSwapHoldings, terraSwapHoldingsSum } = terraSwapHoldingsData;
  const assetsTotalSum = plus(parseFloat(assetsSum), terraSwapHoldingsSum);
  const { allData, stakedSum, unstakedSum } = formatStakeData(stakeData?.data, lunaPrice);
  return {
    address,
    core: {
      coins: [...tokens, ...terraSwapHoldings],
      staking: allData,
      total: { assetsSum: assetsTotalSum.toString(), stakedSum, unstakedSum },
    },
    terraSwapPool,
  };
};
