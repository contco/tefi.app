import { contracts } from "./contracts";
import {wasmStoreRequest} from "@contco/terra-utilities";

export const getLoterraConfig = async () => {
    const params = {config: {}};
    const data = await wasmStoreRequest(contracts.lotteryContract, params);
    return data;
}