import axios from "axios";
import { LCD_URL } from "../utils";

export const wasmStoreRequest = async (contract_addr: string, query_msg: any) => {
    try {
        const {data} = await axios.get(LCD_URL + `wasm/contracts/${contract_addr}/store`, {
            params: {
            query_msg: query_msg
            },
        });
        return data?.result;
    }
    catch(err) {
        return null;
    }
}