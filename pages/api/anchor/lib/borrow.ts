import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { anchor, ContractAddresses } from './test-defaults';
import { getLatestBlockHeight, mantleFetch } from './utils';
import { DEFAULT_MANTLE_ENDPOINTS } from '../../../../utils/ancEndpoints';
import { demicrofy, formatRate, formatUSTWithPostfixUnits } from '@anchor-protocol/notation';
import { getPrice } from '../../terra-core/core';
import { LUNA_DENOM } from '../../terra-core/symbols';

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

export default async (address) => {
  const borrowLimit = await getBorrowLimit({ address });
  const borrowedValue = await getBorrowedValue({ address });
  const collaterals = await getCollaterals({ address });
  const allRewards = await borrowAPYQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet']);
  const rewards = await rewardsClaimableUstBorrowRewardsQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet'], address);
  const percentage = ((parseFloat(borrowedValue) / parseFloat(borrowLimit)) * 100) / 2;
  const lunaPrice = await getPrice(LUNA_DENOM);

  const result = {
    reward: {
      name: 'UST Borrow',
      apy: formatRate(allRewards?.borrowerDistributionAPYs[0]?.DistributionAPY),
      reward: formatUSTWithPostfixUnits(demicrofy(rewards?.borrowerInfo?.pending_rewards)),
    },
    limit: borrowLimit,
    value: borrowedValue,
    collaterals: collaterals && collaterals[0] ? collaterals : null,
    percentage: percentage.toString(),
    price: lunaPrice,
  };

  return result;
};
