/* eslint-disable no-console */
import { anchor, gasParameters, wallet, client } from './test-defaults';
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

export const stakeLP = async () => {
  const result = await anchor.anchorToken.stakeLP('10').execute(wallet, gasParameters);
  console.log('Result', result);
  return result;
};

export const unstakeLP = async () => {
  const result = await anchor.anchorToken.unstakeLP('10').execute(wallet, gasParameters);
  console.log('Result', result);
  return result;
};

export const getLpAPY = async () => {
  const height = await getLatestBlockHeight();
  const result = await client.query({
    query: gql`
      query AnchorLPReward {
        AnchorBorrowerDistributionAPYs(Height: ${height}) {
          DistributionAPY
        }
      }
    `,
  });

  const distributionAPY = result.data.AnchorBorrowerDistributionAPYs[0].DistributionAPY;

  return distributionAPY;
};

export default async ({ args: { address } }: any) => {
  const balance = getLPBalance({ address });
  const staked = stakedLP({ address });
  const lpAPY = getLpAPY();

  return { balance, staked, lpAPY };
};
