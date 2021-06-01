import { anchor } from './test-defaults';

// template only - need ANC, aUST, Bluna
export const getBalance = async (address: any) => {
  const balance = await anchor.anchorToken.getBalance(address);

  const result = [
    {
      amount: balance.toString(),
      symbol: 'ANC',
    },
  ];

  return result;
};
