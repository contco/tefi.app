import axios from "axios";
import { LCD_URL } from "../utils";
import pairs from './constants/pairs.json'

const fetchPoolResponseData = async (address: string) => {
    const { data } = await axios.get(LCD_URL + `wasm/contracts/${address}/store`, {
        params: {
            query_msg: JSON.stringify({
                pool: {}
            })
        },
    });
    return data?.result;
}

const fetchUserPoolBalance = async (address: string, liq_contract: string) => {
    const { data } = await axios.get(LCD_URL + `wasm/contracts/${liq_contract}/store`, {
        params: {
            query_msg: JSON.stringify({
                balance: { address }
            })
        },
    });
    return data?.result;
}

const getPoolResponses = async (pairInfo) => {
    const poolResponses = {};
    const tasks = Object.keys(pairInfo).map(async (key) => {
        const data = await fetchPoolResponseData(pairInfo[key].contract_addr);
        poolResponses[key] = data;
    });
    await Promise.all(tasks);
    return poolResponses;
}

const getUserPoolResponses = async (address, pairInfo) => {
    const poolResponses = {};
    const tasks = Object.keys(pairInfo).map(async (key) => {
        const data = await fetchUserPoolBalance(address, pairInfo[key].liquidity_token);
        poolResponses[key] = data;
    });
    await Promise.all(tasks);
    return poolResponses;
}

export const getPoolsInfo = async () => {
    const poolResponses = await getPoolResponses(pairs);
    const userPoolReponse = await getUserPoolResponses('terra1q2lyn467rhya0475394djyxqhrfzyqs0tegft3', pairs);
    console.log("poolResponses", poolResponses);
    console.log("userPoolReponse", userPoolReponse);
    return poolResponses;
}

