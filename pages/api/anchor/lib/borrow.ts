import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { anchor, gasParameters, wallet, client } from './test-defaults';
import { getLatestBlockHeight } from './utils';
import { gql } from '@apollo/client';

export const getBorrowLimit = async ({ address }: any) => {
  const result = await anchor.borrow.getBorrowLimit({ market: MARKET_DENOMS.UUSD, address });
  return result;
};

export const getBorrowedValue = async ({ address }: any) => {
  const result = await anchor.borrow.getBorrowedValue({ market: MARKET_DENOMS.UUSD, address });
  return result;
};

export const getCollaterals = async ({ address }: any) => {
  const result = await anchor.borrow.getCollaterals({ market: MARKET_DENOMS.UUSD, address });
  return result;
};

export const getBorrowRewards = async ({ address }) => {
  const result = await anchor.anchorToken
    .claimUSTBorrowRewards({ market: MARKET_DENOMS.UUSD, to: address })
    .execute(wallet, gasParameters);
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

  const borrowAPY = result.data.AnchorBorrowerDistributionAPYs[0].DistributionAPY;
  console.log('borrowAPY', borrowAPY);
  return borrowAPY;
};

export default async (address) => {
  const borrowLimit = await getBorrowLimit({ address });
  const borrowedValue = await getBorrowedValue({ address });
  const collaterals = await getCollaterals({ address });
  const borrowApy = await getBorrowAPY();
  return { borrowLimit, borrowedValue, collaterals, borrowApy };
};
