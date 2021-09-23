import axios from 'axios';

const TEST_TX_FETCH_URL = 'https://tequila-fcd.terra.dev/v1/tx/';
const TX_FETCH_URL = 'https://fcd.terra.dev/v1/tx/';

export const formatPostData: (a: any) => postData = (txResult: any) => {
    return {
        memo: txResult?.tx?.value?.memo,
        block: txResult?.height,
        txhash: txResult?.txhash,
        timestamp: txResult?.timestamp,
        from_address: txResult?.tx?.value?.msg[0]?.value.from_address,
        to_address: txResult?.tx?.value?.msg[0]?.value.to_address,
    };
}
export const formatTxData: (a: any) => txData = (txResult: any) => {
  return {
      memo: txResult?.tx?.value?.memo,
      block: txResult?.height,
      txhash: txResult?.txhash,
      timestamp: txResult?.timestamp,
      logs:txResult.logs,
  };
}

export const fetchTx = async (txHash: string, network ='mainnet') => { 
   try {
     const url = network === 'mainnet' ? TX_FETCH_URL : TEST_TX_FETCH_URL;
     const {data} = await axios.get(url+txHash);
     const txData = formatTxData(data);
     return txData;
    }
   catch(err){
     return {error: true, msg: "Error fetching tx data"};
   }
}