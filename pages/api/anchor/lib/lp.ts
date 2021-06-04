/* eslint-disable no-console */
import { anchor, client } from './test-defaults';
import { getLatestBlockHeight } from './utils';
import { gql } from '@apollo/client';

export const getLPBalance = async ({ address }: any) => {
  const result = await anchor.anchorToken.getLPBalance(address);
  return result;
};

export const stakedLP = async ({ address }: any) => {
  const result = await anchor.anchorToken.getProvidedLP(address);
  return result;
};

export const getLpAPY = async () => {
  const height = await getLatestBlockHeight();
  const result = await client.query({
    query: gql`
      query AnchorLPRewards {
        AnchorLPRewards(Height: ${height}) {
          APY
        }
      }
    `,
  });

  const APY = result.data.AnchorLPRewards[0].APY;
  return APY;
};

export default async (address) => {
  const balance = await getLPBalance({ address });
  const staked = await stakedLP({ address });
  const lpAPY = await getLpAPY();

  const result = {
    reward: {
      name: 'ANC-LP',
      staked: staked,
      apy: lpAPY,
    },
    balance: balance,
  };

  return result;
};
