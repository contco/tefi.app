import { anchor } from './test-defaults';

export const getBalance = async ({ address }: any) => {
    const result = await anchor.anchorToken.getBalance(address);
    console.log('result', result);
    return result;
}
