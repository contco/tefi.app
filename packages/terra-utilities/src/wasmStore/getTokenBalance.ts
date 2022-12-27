import { wasmStoreRequest } from "../wasm";

export const getUserTokenBalance = async (address: string, tokenAddr: string) => {
  const queryMsg = {
    balance: { 
      address
    }   
   };
	 const result = await wasmStoreRequest(tokenAddr, queryMsg);
    return result?.balance ?? 0;
};