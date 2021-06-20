import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { anchor, client, ContractAddresses } from './test-defaults';
import { getLatestBlockHeight, mantleFetch } from './utils';
import { gql } from '@apollo/client';
import { DEFAULT_MANTLE_ENDPOINTS } from '../../../../utils/ancEndpoints';
import { demicrofy, formatRate, formatUSTWithPostfixUnits } from '@anchor-protocol/notation';

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

export const getBorrowAPY = async () => {
  const height = await getLatestBlockHeight();
  const result = await client.query({
    query: gql`
      query AnchorBorrowerAPY {
        AnchorBorrowerDistributionAPYs(Height: ${height}) {
          DistributionAPY
        }
      }
    `,
  });

  const borrowAPY = result.data.AnchorBorrowerDistributionAPYs[0]?.DistributionAPY;
  return borrowAPY;
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

export default async (address) => {
  const borrowLimit = await getBorrowLimit({ address });
  const borrowedValue = await getBorrowedValue({ address });
  const collaterals = await getCollaterals({ address });
  const borrowApy = await getBorrowAPY();
  const rewards = await rewardsClaimableUstBorrowRewardsQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet'], address);

  const result = {
    reward: {
      name: 'UST Borrow',
      apy: formatRate(borrowApy),
      reward: formatUSTWithPostfixUnits(demicrofy(rewards?.borrowerInfo?.pending_rewards)),
    },
    limit: borrowLimit,
    value: borrowedValue,
    collaterals: collaterals,
  };

  return result;
};
