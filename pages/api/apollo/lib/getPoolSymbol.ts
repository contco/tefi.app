import { coinSymbolList } from "../../spectrum/lib/coinInfos/list";


export const getPoolSymbol = (poolResponse: any) => {
    const contractAddress = poolResponse.assets[0].info?.token ? poolResponse.assets[0].info?.token.contract_addr : poolResponse.assets[1].info?.token.contract_addr;
    const symbol1 = 'UST';
    const symbol2 = coinSymbolList[contractAddress]; 
    const lpName = `${symbol2}-${symbol1} LP`;
    return {symbol1, symbol2, lpName};
}