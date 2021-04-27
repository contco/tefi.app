import { LCDClient, Coin } from '@terra-money/terra.js';


const terra = new LCDClient({ URL: 'https://tequila-lcd.terra.dev', chainID: 'tequila-0004' });


export const getBalance = async ({ args: { address } }: any) => {
    const balance = await terra.bank.balance(address);
    const coins = balance.toData();
    return coins;
}