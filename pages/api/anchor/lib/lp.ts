/* eslint-disable no-console */
import { anchor, gasParameters, wallet } from './test-defaults';

export const getLPBalance = async ({ address }: any) => {
  const result = await anchor.anchorToken.getLPBalance(address);
  console.log('Result', result);
  return result;
};

export const stakedLP = async ({ address }: any) => {
  const result = await anchor.anchorToken.getProvidedLP(address);
  console.log('Result', result);
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

export const getLPrewards = async () => {
  const result = await anchor.anchorToken.claimLPRewards().generateWithWallet(wallet);
  console.log('Result', result);
  return result;
};

export default async ({ args: { address } }: any) => {
  const balance = getLPBalance({ address });
  const staked = stakedLP({ address });

  return { balance, staked };
};
