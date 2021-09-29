import { wasmStoreRequest } from "@contco/terra-utilities";
import { calculatePoolData } from "./calculatePool";
import pairs from './constants/pairs.json'

const fetchPoolResponseData = async (address: string) => {
    const queryMessage = {
        pool: {}
    }
    const data = await wasmStoreRequest(address, queryMessage);
    return data;
}

const fetchUserPoolBalance = async (address: string, liq_contract: string) => {
    const queryMessage = {
        balance: { address }
    }
    const data = await wasmStoreRequest(liq_contract, queryMessage);
    return data;
}

const getPoolResponses = async (pairInfo) => {
    const poolResponses = {};
    const tasks = Object.keys(pairInfo).map(async (key) => {
        const data = await fetchPoolResponseData(pairInfo[key].contract_addr);
        poolResponses[key] = { ...data, liquidity_token: pairInfo[key].liquidity_token, contract_addr: pairInfo[key].contract_addr };
    });
    await Promise.all(tasks);
    return poolResponses;
}

const getUserPoolBalances = async (address, pairInfo) => {
    const poolResponses = {};
    const tasks = Object.keys(pairInfo).map(async (key) => {
        const data = await fetchUserPoolBalance(address, pairInfo[key].liquidity_token);
        poolResponses[key] = { ...data, liquidity_token: pairInfo[key].liquidity_token, contract_addr: pairInfo[key].contract_addr };
    });
    await Promise.all(tasks);
    return poolResponses;
}

export const getTerraSwapPoolData = async (address) => {
    try {
    const userPoolBalance = await getUserPoolBalances(address, pairs);
    const poolFiltered = {}
    Object.keys(userPoolBalance).map((key, value) => {
        if (Number(userPoolBalance[value].balance) > 0) {
            poolFiltered[key] = userPoolBalance[value]
        }
    });
    const poolResponses = await getPoolResponses(poolFiltered);
    const poolsInfo = await calculatePoolData(poolResponses, userPoolBalance);
    return poolsInfo;
    }
    catch(err){
        return {list: [], total: '0'}
    }
}

