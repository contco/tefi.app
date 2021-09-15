import { coinSymbolList } from "../../spectrum/lib/coinInfos/list";


export const getPoolSymbol = (poolResponse: any) => {
    const contractAddress = poolResponse.assets[0].info?.token ? poolResponse.assets[0].info?.token.contract_addr : poolResponse.assets[1].info?.token.contract_addr;
    const symbol1 = coinSymbolList[contractAddress]; 
    const symbol2 = 'UST';
    const lpName = `${symbol1}-${symbol2} LP`;
    return {symbol1, symbol2, lpName};
}