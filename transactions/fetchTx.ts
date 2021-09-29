import axios from 'axios';
import { MICRO } from '@contco/terra-utilities';
const TEST_TX_FETCH_URL = 'https://tequila-fcd.terra.dev/v1/tx/';
const TX_FETCH_URL = 'https://fcd.terra.dev/v1/tx/';

const denomSymbol = {
  uusd:'UST',
  uluna:'LUNA'
}

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

const txTypeIdentification = (logs) => {
  let type  = '';
  let details = '';
  const regex = /\D+|\d+/g;
  console.log(logs)
  if(Array.isArray(logs)){
    logs.map(a => {
      a.events.map((b) =>{
        switch (b.type) {
          case 'transfer':
            type = 'sent'
            let amount, symbol, recipient;
            b.attributes.map(c =>{
              if(c.key === 'amount'){
                const [number, denom] = c.value.match(regex);
                 amount = parseFloat(number)/MICRO
                 symbol =  denomSymbol[denom]
              }
              if(c.key === 'recipient'){
                recipient = c.value.toString()
              }
              if(amount && symbol && recipient){
                details = `${'Sent ' + amount + ' ' + symbol + ' to ' + recipient}`
              }
            })
            break;
          case '':
            break
        
          default:
            break;
        }
      })
    })
  }
  else {

  }

  return {type, details}
}

export const formatTxData: (a: any) => txData = (txResult: any) => {
  return {
      memo: txResult?.tx?.value?.memo,
      block: txResult?.height,
      txhash: txResult?.txhash,
      timestamp: txResult?.timestamp,
      ...txTypeIdentification(txResult.logs)
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