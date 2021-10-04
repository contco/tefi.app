import { contracts } from "./contracts";
import {wasmStoreRequest} from "@contco/terra-utilities";

export const getTWDConfig = async () => {
    const params = {config: {}};
    const data = await wasmStoreRequest(contracts.twdContract, params);
    return data;
}