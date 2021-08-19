import { assets } from "../../constants/assets";
import { subYears } from 'date-fns';
import { request } from 'graphql-request';
import { TERRA_SWAP_GRAPHQL_URL } from "../../constants";
import { GET_PAIRS_DATA } from "../../graphql/queries/getPairsData";
import { getTokenKey } from ".";

export const fecthPairData = async () => {
    const poolAddresses = Object.keys(assets).map((keyName) => assets[keyName].poolAddress);
    const toDate = new Date();
    const fromDate = subYears(toDate, 1);

    let data: any = {};

    try {
        const { pairs } = await request(TERRA_SWAP_GRAPHQL_URL, GET_PAIRS_DATA, {
            from: fromDate.getTime() / 1000,
            to: toDate.getTime() / 1000,
            interval: 'DAY',
            pairAddresses: poolAddresses,
        });
        Object.keys(assets).map((keyName: string, index: number) => {
            data[keyName] = { ...assets[keyName], ...pairs[index], tokenKey: getTokenKey(pairs[index], keyName) };
        });
    } catch (error) {
        data = {};
    }
    return data;
};