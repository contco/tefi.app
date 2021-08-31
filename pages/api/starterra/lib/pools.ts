import axios from 'axios';
import { getLastSyncedHeight } from '../../anchor/lib/utils';
import { getPrice } from '../../commons';
import { LCD_URL } from '../../utils';
import { contracts } from './contracts';

const valueConversion = (value) => parseFloat(value) / 1000000;

const stakingContracts = [
  { name: 'Lunatics', contract: contracts.lunatics },
  { name: 'Interstellars', contract: contracts.interstellars },
  { name: 'Degens', contract: contracts.degens },
];

export const getPoolData = async () => {
  try {
    const { data } = await axios.get(LCD_URL + `wasm/contracts/${contracts.pool}/store`, {
      params: {
        query_msg: JSON.stringify({
          pool: {},
        }),
      },
    });

    return data;
  } catch (err) {
    return {};
  }
};

export const fetchStarPoolResponseData = async (address: string, contract: string) => {
  const lastSyncedHeight = await getLastSyncedHeight();

  try {
    const result = await axios.get(
      LCD_URL +
        `wasm/contracts/${contract}/store?query_msg=%7B%22staker_info%22:%7B%22staker%22:%22${address}%22,%22block_time%22:${lastSyncedHeight}%7D%7D`,
    );

    return result;
  } catch (err) {
    return null;
  }
};

export const getLPData = async (address: string) => {
  try {
    const { data } = await axios.get(LCD_URL + `wasm/contracts/${contracts.lp}/store`, {
      params: {
        query_msg: JSON.stringify({
          balance: {
            address: address,
          },
        }),
      },
    });

    const poolData = await getPoolData();
    const singleLPValue = (parseFloat(poolData.result.assets[0].amount) / parseFloat(poolData.result.total_share)) * 2;
    const sttPrice = await getPrice(poolData.result);
    const stakableLP = valueConversion(data.result.balance);
    const stakableToken1 = (stakableLP / 2) * singleLPValue;
    const stakableToken2 = stakableToken1 / parseFloat(sttPrice);

    const stakedData = await Promise.all(
      stakingContracts.map(async (contract) => {
        const starPoolData = await fetchStarPoolResponseData(address, contract.contract);
        const stakedLP = valueConversion(starPoolData.data.result.bond_amount);
        const stakedLpUstValue = stakedLP * singleLPValue;
        const stakedToken1 = (stakedLP / 2) * singleLPValue;
        const stakedToken2 = stakedToken1 / parseFloat(sttPrice);
        const reward = valueConversion(starPoolData.data.result.pending_reward);
        const rewardValue = reward * parseFloat(sttPrice);

        return {
          lpname: 'STT-UST',
          faction: contract.name,
          stakedLP: stakedLP.toString(),
          stakedLPUstValue: stakedLpUstValue.toString(),
          token1Staked: stakedToken1.toString(),
          token2Staked: stakedToken2.toString(),
          rewards: reward.toString(),
          rewardsValue: rewardValue.toString(),
        };
      }),
    );

    return {
      stakedData: stakedData,
      singleLPValue: singleLPValue,
      stakableLP: stakableLP.toString(),
      token1UnStaked: stakableToken1.toString(),
      token2UnStaked: stakableToken2.toString(),
    };
  } catch (err) {
    return {
      stakedData: null,
      singleLPValue: 0,
      stakableLP: '0',
      token1UnStaked: '0',
      token2UnStaked: '0',
    };
  }
};

export default async (address) => {
  const { stakedData, singleLPValue, stakableLP, token1UnStaked, token2UnStaked } = await getLPData(address);
  const totalStakedLP = stakedData?.reduce((a, staked) => a + parseFloat(staked?.stakedLP), 0);
  const totalStakedLPValue = singleLPValue * totalStakedLP;
  const totalReward = stakedData?.reduce((a, staked) => a + parseFloat(staked?.rewards), 0);
  const totalRewardValue = stakedData?.reduce((a, staked) => a + parseFloat(staked?.rewardsValue), 0);

  return {
    stakedData,
    stakableLP,
    symbol1: 'STT',
    symbol2: 'UST',
    token1UnStaked,
    token2UnStaked,
    totalStakedLP: totalStakedLP?.toString(),
    totalStakedLPUstValue: totalStakedLPValue?.toString(),
    totalRewards: totalReward?.toString(),
    totalRewardsValue: totalRewardValue?.toString(),
  };
};
