import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { LCD_URL } from '@contco/terra-utilities';
import { anchor, blocksPerYear, ContractAddresses } from './test-defaults';
import { getLatestBlockHeight, mantleFetch, BASSETS_INFO } from './utils';
import { formatRate, valueConversion } from './utils';
import { MANTLE_URL } from '../../utils';
import { getPrice } from '../../terra-core/core';
import { LUNA_DENOM } from '../../terra-core/symbols';
import axios from 'axios';
import { ancPriceQuery } from './ancPrice';
import { fetchData } from '../../commons';
import { UNIT } from '../../mirror/utils';
import { getAnchorApyStats } from './getAncApyStats';

const name = 'UST Borrow';

const bETHContract = 'terra1dzhzukyezv0etz22ud940z7adyv7xgcjkahuun'

export const REWARDS_CLAIMABLE_UST_BORROW_REWARDS_QUERY = `
  query (
    $marketContract: String!
    $ancContract: String!
    $borrowerInfoQuery: String!
    $userAncBalanceQuery: String!
    $marketStateQuery: String!
  ) {
    borrowerInfo: WasmContractsContractAddressStore(
      ContractAddress: $marketContract
      QueryMsg: $borrowerInfoQuery
    ) {
      Result
    }
    userANCBalance: WasmContractsContractAddressStore(
      ContractAddress: $ancContract
      QueryMsg: $userAncBalanceQuery
    ) {
      Result
    }
    marketState: WasmContractsContractAddressStore(
      ContractAddress: $marketContract
      QueryMsg: $marketStateQuery
    ) {
      Result
    }
  }
`;

export const BORROW_RATE_QUERY = `
  query ($marketContract: String!) {
    marketBalances: BankBalancesAddress(Address: $marketContract) {
      Result {
        Denom
        Amount
      }
    }
    marketState: WasmContractsContractAddressStore(
      ContractAddress: "terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s"
        QueryMsg: "{\\"state\\":{}}"
    ) {
        Result  
      }              
    },
`;

export const GET_COLLATERALS_QUERY = `
  query (
    $overseerContract: String!
    $getCollateralsQuery: String!
  ) {
    overseerCollaterals: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $getCollateralsQuery
    ) {
      Result
    }
  }
`;

export const getBorrowLimit = async ({ address }: any) => {
  const result = await anchor.borrow.getBorrowLimit({ market: MARKET_DENOMS.UUSD, address });
  return result;
};

export const getBorrowedValue = async ({ address }: any) => {
  const result = await anchor.borrow.getBorrowedValue({ market: MARKET_DENOMS.UUSD, address });
  return result.toString();
};

export const getCollaterals = async ({ address }: any) => {
  const rawData = await mantleFetch(
    GET_COLLATERALS_QUERY,
    {
      overseerContract: ContractAddresses['overseer'],
      getCollateralsQuery: JSON.stringify({
        collaterals: {
          borrower: address,
        },
      }),
    },
    `${MANTLE_URL}/?borrow--borrower`,
  );
  const result = JSON.parse(rawData?.overseerCollaterals?.Result)

  const bEthRequest = await fetchData(BASSETS_INFO + 'beth');
  const bEthPrice = bEthRequest?.data?.beth_price;

  const bLUNARequest = await fetchData(BASSETS_INFO + 'bluna');
  const bLUNAPrice = bLUNARequest?.data?.bLuna_price;
  let totalValue = 0;
  if (result?.collaterals.length){
    const resultCollateral = result.collaterals.map((item) => {
      const collateral = item[0];
      const price = collateral == bETHContract ? bEthPrice : bLUNAPrice;
      const balance = parseFloat(item[1])/UNIT || 0;
      const value = (balance * parseFloat(price));
      totalValue += value; 
      return {
        collateral,
        balance:balance.toString(),
        price,
        value:value.toString(),
        symbol: collateral == bETHContract ? "bEth" : "bLuna"
      }
    });
    return {totalValue:totalValue.toString(),resultCollateral}
  }
  return {totalValue:"0",resultCollateral:[]}
};

export const rewardsClaimableUstBorrowRewardsQuery = async (mantleEndpoint, address) => {
  const blockHeight = await getLatestBlockHeight();

  const rawData = await mantleFetch(
    REWARDS_CLAIMABLE_UST_BORROW_REWARDS_QUERY,
    {
      marketContract: ContractAddresses['moneyMarket'],
      ancContract: ContractAddresses['cw20'],
      borrowerInfoQuery: JSON.stringify({
        borrower_info: {
          borrower: address,
          block_height: blockHeight - 1,
        },
      }),
      userAncBalanceQuery: JSON.stringify({
        balance: {
          address: address,
        },
      }),
      marketStateQuery: JSON.stringify({
        state: {},
      }),
    },
    `${mantleEndpoint}?rewards--claimable-ust-borrow-rewards`,
  );

  return {
    borrowerInfo: JSON.parse(rawData?.borrowerInfo?.Result),
    userANCBalance: JSON.parse(rawData?.userANCBalance?.Result),
    marketState: JSON.parse(rawData?.marketState?.Result),
  };
};

export const getBorrowRate = async () => {
  const market_states = await axios.get(`${MANTLE_URL}/?borrow--market-states`, {
    params: {
      query: BORROW_RATE_QUERY,
      variables: { marketContract: 'terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s' },
    },
  });

  const rate = await axios.get(LCD_URL + `wasm/contracts/terra1kq8zzq5hufas9t0kjsjc62t2kucfnx8txf547n/store`, {
    params: {
      query_msg: JSON.stringify({
        borrow_rate: {
          market_balance: market_states.data.data.marketBalances.Result[0].Amount,
          total_reserves: JSON.parse(market_states.data.data.marketState.Result)['total_reserves'],
          total_liabilities: JSON.parse(market_states.data.data.marketState.Result)['total_liabilities'],
        },
      }),
    },
  });

  return rate;
};
export default async (address) => {
  try {
    const [borrowLimit, borrowedValue, collateralsData, allRewards, rewards, lunaPrice, borrowRate, { ancPrice }] = await Promise.all([
      getBorrowLimit({ address }),
      getBorrowedValue({ address }),
      getCollaterals({ address }),
      getAnchorApyStats(),
      rewardsClaimableUstBorrowRewardsQuery(MANTLE_URL, address),
      getPrice(LUNA_DENOM),
      getBorrowRate(),
      ancPriceQuery(MANTLE_URL)
    ]);
    const percentage = (parseFloat(borrowedValue) / parseFloat(borrowLimit)) * 100 * 0.6;
    const distributionAPY = allRewards?.distributionAPY;
    const borrowApy = borrowRate?.data?.result?.rate * blocksPerYear;
    const netApy = (parseFloat(distributionAPY) - borrowApy).toString();
    const collaterals = collateralsData.resultCollateral.length > 0 ? collateralsData.resultCollateral : null;
    const result = {
      reward: {
        name,
        apy: formatRate(distributionAPY),
        reward: valueConversion(rewards?.borrowerInfo?.pending_rewards),
      },
      limit: borrowLimit,
      value: borrowedValue,
      collaterals,
      totalCollateralValue: collateralsData.totalValue,
      percentage: percentage.toString(),
      lunaprice: lunaPrice,
      ancprice: ancPrice.ANCPrice,
      netApy: formatRate(netApy),
    };

    return result;
  }
  catch (err) {
    const result = {
      reward: {
        name,
        apy: '0',
        reward: '0',
      },
      limit: '0',
      value: '0',
      collaterals: null,
      totalCollateralValue:"0",
      percentage: '0',
      lunaprice: '0',
      ancprice: '0',
      netApy: '0',
      bEthPrice: '0',
    };
    return result;
  }
};
