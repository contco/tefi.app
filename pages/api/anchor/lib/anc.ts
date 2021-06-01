import { anchor } from './test-defaults';
import getBorrowData from './borrow';
import getEarnData from './earn';
import getLPData from './lp';
import getGovData from './gov';

// template only - need ANC, aUST, Bluna
export const getBalance = async (address: any) => {
  const balance = await anchor.anchorToken.getBalance(address);
  const borrowData = await getBorrowData(address);
  const earnData = await getEarnData(address);
  const lpData = await getLPData(address);
  const govData = await getGovData();

  console.log('balance', balance);

  return [
    {
      amount: balance.toString(),
      symbol: 'ANC',
      borrow: borrowData,
      earn: earnData,
      lp: lpData,
      gov: govData,
    },
  ];
};
