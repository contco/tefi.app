import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { anchor, blocksPerYear, ContractAddresses } from './test-defaults';
import { getLatestBlockHeight, mantleFetch } from './utils';
import { DEFAULT_MANTLE_ENDPOINTS } from '../../../../utils/ancEndpoints';
import { demicrofy, formatRate, formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { getPrice } from '../../terra-core/core';
import { LUNA_DENOM } from '../../terra-core/symbols';
import axios from 'axios';
import { ancPriceQuery } from './ancPrice';

const LCDURL = 'https://lcd.terra.dev/';
const name = 'UST Borrow';

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

export const BORROW_APY_QUERY = `
  query {
    borrowerDistributionAPYs: AnchorBorrowerDistributionAPYs(
      Order: DESC
      Limit: 1
    ) {
      Height
      Timestamp
      DistributionAPY
    }
    govRewards: AnchorGovRewardRecords(Order: DESC, Limit: 1) {
      CurrentAPY
      Timestamp
      Height
    }
    lpRewards: AnchorLPRewards(Order: DESC, Limit: 1) {
      Height
      Timestamp
      APY
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

export const getBorrowLimit = async ({ address }: any) => {
  const result = await anchor.borrow.getBorrowLimit({ market: MARKET_DENOMS.UUSD, address });
  return result;
};

export const getBorrowedValue = async ({ address }: any) => {
  const result = await anchor.borrow.getBorrowedValue({ market: MARKET_DENOMS.UUSD, address });
  return result.toString();
};

export const getCollaterals = async ({ address }: any) => {
  const result = await anchor.borrow.getCollaterals({ market: MARKET_DENOMS.UUSD, address });
  return result;
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

export async function borrowAPYQuery(mantleEndpoint) {
  return await mantleFetch(BORROW_APY_QUERY, {}, `${mantleEndpoint}?borrow--apy`);
}

export const getBorrowRate = async () => {
  const market_states = await axios.get('https://mantle.anchorprotocol.com/?borrow--market-states', {
    params: {
      query: BORROW_RATE_QUERY,
      variables: { marketContract: 'terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s' },
    },
  });

  const rate = await axios.get(LCDURL + `wasm/contracts/terra1kq8zzq5hufas9t0kjsjc62t2kucfnx8txf547n/store`, {
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
  const [borrowLimit, borrowedValue, collaterals, allRewards, rewards, lunaPrice, borrowRate, {ancPrice}] = await Promise.all([getBorrowLimit({ address }), getBorrowedValue({ address }), getCollaterals({ address }), borrowAPYQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet']), rewardsClaimableUstBorrowRewardsQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet'], address), getPrice(LUNA_DENOM), getBorrowRate(), ancPriceQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet']) ]);
  const percentage = (parseFloat(borrowedValue) / parseFloat(borrowLimit)) * 100 * 0.6;
  const distributionAPY = allRewards?.borrowerDistributionAPYs[0]?.DistributionAPY;
  const borrowApy = borrowRate?.data?.result?.rate * blocksPerYear;
  const netApy = (parseFloat(distributionAPY) - borrowApy).toString();

  const result = {
    reward: {
      name,
      apy: formatRate(distributionAPY),
      reward: formatUSTWithPostfixUnits(demicrofy(rewards?.borrowerInfo?.pending_rewards)),
    },
    limit: borrowLimit,
    value: borrowedValue,
    collaterals: collaterals && collaterals[0] ? collaterals : null,
    percentage: percentage.toString(),
    lunaprice: lunaPrice,
    ancprice: ancPrice.ANCPrice,
    netApy: formatRate(netApy),
  };

  return result;
 }
 catch(err){
   const result = {
    reward: {
      name,
      apy: '0',
      reward: '0',
    },
    limit: '0',
    value: '0',
    collaterals:  null,
    percentage: '0',
    lunaprice: '0',
    ancprice: '0',
    netApy: '0',
  };
  return result;
 }
};
