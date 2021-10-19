import axios from 'axios';
import { math, MICRO } from '@contco/terra-utilities';
import MIRROR_ASSETS from './mirrorAssets.json';
import { getAssetsStats } from './getAssetsStats';
import { getShortApr } from './getAccountData';
import { getStakingRewards } from './getStakingRewards';
import { ANC, aUST, secondsToDate } from './utils';
import { anchor } from '../anchor/lib/test-defaults';
import { getPrice } from '../terra-core/core';
import { LUNA_DENOM } from '../terra-core/symbols';
import { getLastSyncedHeight } from '../anchor/lib/utils';
import { MANTLE_URL } from '../utils';


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

const ANCHOR_MARKET_EPOCH_STATE = `
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

const valueConversion = (value) => value / MICRO;

export const getRewards = (token, mirPrice, stakingRewards) => {
  const shortRewards = stakingRewards.reward_infos.filter((asset) => asset.is_short === true);
  const assetReward = shortRewards.filter((asset) => asset.asset_token === token)[0];
  const reward = math.div(parseFloat(assetReward.pending_reward), MICRO);
  const rewardValue = math.times(reward, mirPrice);
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
    return null;
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
     return '0';
  }
};

const getAUSTInfo = async () => {
  const lastSyncedHeight = await getLastSyncedHeight();
  try {
    const austInfo = await axios.get(MANTLE_URL + `?anchorMarketEpochState`, {
      params: {
        query: ANCHOR_MARKET_EPOCH_STATE,
        variables: {
          contract: 'terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s',
          msg: JSON.stringify({ epoch_state: { block_height: lastSyncedHeight } }),
        },
      },
    });
    if (austInfo) {
      return JSON.parse(austInfo?.data?.data?.WasmContractsContractAddressStore?.Result)?.exchange_rate;
    } else return '0';
  } catch (err) {
    return '0';
  }
};

const getCollateralInfo = async (collateral, asset, oraclePrice) => {
  let collateralInfo: {
    symbol: string;
    collateral: number;
    collateralValue: number;
    collateralRatio: number;
  } = {
    symbol: '',
    collateral: 0,
    collateralValue: 0,
    collateralRatio: 0,
  };
  try {
  const contractAddr = collateral?.info?.token
    ? collateral?.info?.token?.contract_addr
    : collateral?.info?.native_token?.denom;

  if (contractAddr.includes('terra')) {
    if (contractAddr === ANC) {
      const ancPrice = await anchor.anchorToken.getANCPrice();
      const collateralValue = parseFloat(ancPrice) * collateral?.amount;
      collateralInfo = {
        symbol: 'ANC',
        collateral: collateral.amount,
        collateralValue: collateralValue,
        collateralRatio: (valueConversion(collateralValue) / (valueConversion(asset.amount) * oraclePrice)) * 100,
      };
    } else if (contractAddr === aUST) {
      const exchangeRate = await getAUSTInfo();
      const collateralValue = parseFloat(exchangeRate) * collateral?.amount;

      collateralInfo = {
        symbol: 'aUST',
        collateral: collateral.amount,
        collateralValue: collateralValue,
        collateralRatio: (valueConversion(collateralValue) / (valueConversion(asset.amount) * oraclePrice)) * 100,
      };
    } else {
      const info = getAssetInfo(collateral.info.token.contract_addr);
      const price = await getOraclePrice(collateral.info.token.contract_addr);
      const collateralValue = parseFloat(price) * collateral?.amount;
      collateralInfo = {
        symbol: info?.symbol,
        collateral: collateral.amount,
        collateralValue: collateralValue,
        collateralRatio: (valueConversion(collateralValue) / (valueConversion(asset.amount) * oraclePrice)) * 100,
      };
    }
  } else if (contractAddr === 'uluna') {
    const lunaPrice = await getPrice(LUNA_DENOM);
    const collateralValue = parseFloat(lunaPrice) * collateral?.amount;
    collateralInfo = {
      symbol: 'LUNA',
      collateral: collateral.amount,
      collateralValue: collateralValue,
      collateralRatio: (valueConversion(collateralValue) / (valueConversion(asset.amount) * oraclePrice)) * 100,
    };
  } else {
    collateralInfo = {
      symbol: 'UST',
      collateral: collateral.amount,
      collateralValue: parseFloat(collateral.amount),
      collateralRatio: (valueConversion(collateral.amount) / (valueConversion(asset.amount) * oraclePrice)) * 100,
    };
  }

  return collateralInfo;  
  }
  catch(err){
    return collateralInfo;
  }
};

const getLockedInfo = async (idx) => {
  try {
    const lockInfo = await axios.get(MANTLE_URL + `?lockPositionInfo`, {
      params: {
        query: LOCK_POSITION_INFO_QUERY(idx),
      },
    });

    return JSON.parse(lockInfo?.data.data[`position${idx}`]?.Result);
  } catch (err) {
    return null;
  }
};

export const getShortInfo = async (address: string) => {
  try {
    const mintInfo = await getMintInfo(address);
    if(mintInfo){
    const positions = JSON.parse(mintInfo?.data?.data?.WasmContractsContractAddressStore?.Result)?.positions;
    const assetStatsPromise = getAssetsStats();
    const stakingRewardsPromise = getStakingRewards(address);

    const [assetStats, stakingRewards] = await Promise.all([assetStatsPromise, stakingRewardsPromise]);

    const mirPrice = assetStats?.statistic?.mirPrice;
    if(positions) {
    const totalShortInfo = await Promise.all(
      positions.map(async (position) => {
        const { asset, collateral, idx } = position;
        const lockedInfo = await getLockedInfo(idx);
        const rewards = getRewards(asset.info.token.contract_addr, mirPrice, stakingRewards);
        const shortApr = getShortApr(assetStats, asset.info.token.contract_addr);
        const assetInfo = getAssetInfo(asset.info.token.contract_addr);
        const oraclePrice = await getOraclePrice(asset.info.token.contract_addr);

        const currentDate = new Date().getTime() / 1000;

        const locked_amount = lockedInfo?.unlock_time > currentDate ? lockedInfo?.locked_amount : 0;
        const unlocked_amount = lockedInfo?.unlock_time < currentDate ? lockedInfo?.locked_amount : 0;
        const timeString = lockedInfo?.unlock_time > currentDate ? secondsToDate(lockedInfo?.unlock_time) : null;

        const collateralInfo = await getCollateralInfo(collateral, asset, oraclePrice);

        const shortInfo = {
          assetInfo: {
            idx: idx,
            name: assetInfo?.symbol + ' Short',
            symbol: assetInfo?.symbol,
            price: oraclePrice,
            token: asset.info.token.contract_addr,
          },
          borrowInfo: {
            amount: valueConversion(asset.amount).toString(),
            amountValue: (valueConversion(asset.amount) * oraclePrice).toString(),
            shortApr: shortApr,
          },
          lockedInfo: {
            locked_amount: valueConversion(locked_amount).toString(),
            unlocked_amount: valueConversion(unlocked_amount).toString(),
            unlock_time: timeString,
            reward: rewards.reward,
            rewardValue: rewards.rewardValue,
            shorted: valueConversion(parseFloat(asset?.amount)).toString(),
          },
          collateralInfo: {
            collateral: valueConversion(collateralInfo?.collateral).toString(),
            collateralValue: valueConversion(collateralInfo?.collateralValue).toString(),
            collateralRatio: (collateralInfo?.collateralRatio).toString(),
            csymbol: collateralInfo?.symbol,
          },
        };
        return shortInfo;
      }),
    );
    return totalShortInfo;
    }
   }
    return [];
  } catch (err) {
    return [];
  }
};

export default async (address: string) => {
  try {
  const shortData = await getShortInfo(address);
  return shortData;
  }
  catch(err) {
  return [];
}
};
