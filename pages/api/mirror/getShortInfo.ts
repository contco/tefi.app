import axios from 'axios';
import MIRROR_ASSETS from './mirrorAssets.json';
import { getAssetsStats } from './getAssetsStats';
import { getShortApr } from './getAccountData';
import { getPairPool } from './getPairPool';
import { getStakingRewards } from './getStakingRewards';
import { balance, BalanceKey, div, times, UNIT } from './utils';

const MANTLE_URL = 'https://mantle.terra.dev/';

const MINT_POSITIONS_QUERY = `
query WasmContractsContractAddressStore($contract: String, $msg: String) {
  WasmContractsContractAddressStore(
    ContractAddress: $contract
    QueryMsg: $msg
    ) {
      Height
      Result
    }
  }
  `;

const GET_ASSET_PRICE = (contract) => `
  query oraclePrice {  
    result: WasmContractsContractAddressStore(
      ContractAddress: "terra1t6xe0txzywdg85n6k8c960cuwgh6l8esw6lau9"
      QueryMsg: "{\\"price\\":{\\"base_asset\\":\\"${contract}\\",\\"quote_asset\\":\\"uusd\\"}}"
      ) {
        Height
        Result
      },
    }  
    `;

const LOCK_POSITION_INFO_QUERY = (idx: number) => `
    query lockPositionInfo {
      position${idx}: WasmContractsContractAddressStore(
        ContractAddress: "terra169urmlm8wcltyjsrn7gedheh7dker69ujmerv2"
        QueryMsg: "{\\"position_lock_info\\":{\\"position_idx\\":\\"${idx}\\"}}"
        ) {
          Height
          Result
        },
      }
      `;

const getAssetInfo = (token) => {
  return MIRROR_ASSETS.filter((asset) => asset.token === token)[0];
};

const valueConversion = (value) => value / UNIT;

export const getRewards = (rewardsBalance, token, mirPrice) => {
  const reward = div(rewardsBalance[token], UNIT);
  const rewardValue = times(reward, mirPrice);
  return { reward, rewardValue };
};

export const getMintInfo = async (address: string) => {
  try {
    const mintInfo = await axios.get(MANTLE_URL + `?mintPositions`, {
      params: {
        query: MINT_POSITIONS_QUERY,
        variables: {
          contract: 'terra1wfz7h3aqf4cjmjcvc6s8lxdhh7k30nkczyf0mj',
          msg: JSON.stringify({ positions: { owner_addr: address, limit: 30 } }),
        },
      },
    });

    return mintInfo;
  } catch (err) {
    getMintInfo(address);
  }
};

export const getOraclePrice = async (contract) => {
  try {
    const oraclePrice = await axios.get(MANTLE_URL + `?oraclePrice`, {
      params: {
        query: GET_ASSET_PRICE(contract),
      },
    });

    return JSON.parse(oraclePrice?.data?.data?.result?.Result)?.rate;
  } catch (err) {
    getOraclePrice(contract);
  }
};

export const getLockInfo = async (address: string) => {
  try {
    const mintInfo = await getMintInfo(address);
    const positions = JSON.parse(mintInfo?.data?.data?.WasmContractsContractAddressStore?.Result).positions;
    const assetStatsPromise = getAssetsStats();
    const pairsListPromise = await getPairPool();
    const stakingRewardsPromise = getStakingRewards(address);

    const [assetStats, pairsList, stakingRewards] = await Promise.all([
      assetStatsPromise,
      pairsListPromise,
      stakingRewardsPromise,
    ]);

    const rewardsBalance = balance[BalanceKey.REWARD](pairsList as any, stakingRewards);
    const mirPrice = assetStats?.statistic?.mirPrice;

    const totalShortInfo = Promise.all(
      positions.map(async (position) => {
        const { asset, collateral, idx } = position;
        const lockInfo = await axios.get(MANTLE_URL + `?lockPositionInfo`, {
          params: {
            query: LOCK_POSITION_INFO_QUERY(idx),
          },
        });

        const rewards = getRewards(rewardsBalance, asset.info.token.contract_addr, mirPrice);
        const lockedInfo = JSON.parse(lockInfo?.data.data[`position${idx}`].Result);
        const shortApr = getShortApr(assetStats, asset.info.token.contract_addr);
        const assetInfo = getAssetInfo(asset.info.token.contract_addr);
        const oraclePrice = await getOraclePrice(asset.info.token.contract_addr);

        const shortInfo = {
          assetInfo: {
            idx: idx,
            name: assetInfo.symbol + ' Short',
            symbol: assetInfo.symbol,
            price: oraclePrice,
            token: asset.info.token.contract_addr,
          },
          borrowInfo: {
            amount: valueConversion(asset.amount).toString(),
            amountValue: (valueConversion(asset.amount) * oraclePrice).toString(),
            shortApr: shortApr,
          },
          lockedInfo: {
            locked_amount: valueConversion(lockedInfo?.locked_amount).toString(),
            unlock_time: lockedInfo?.unlock_time,
            reward: rewards.reward,
            rewardValue: rewards.rewardValue,
            shorted: valueConversion(parseFloat(asset?.amount)).toString(),
          },
          collateralInfo: {
            collateral: valueConversion(collateral.amount).toString(),
            collateralRatio: (
              (valueConversion(collateral.amount) / (valueConversion(asset.amount) * oraclePrice)) *
              100
            ).toString(),
          },
        };

        return shortInfo;
      }),
    );
    return totalShortInfo;
  } catch (err) {
    getLockInfo(address);
  }
};

export default async (address: string) => {
  const shortData = await getLockInfo(address);

  if (shortData) {
    return shortData;
  }
  return null;
};
