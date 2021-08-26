import { fetchData } from "../commons"
import { UNIT } from "../mirror/utils";
const ADDRESS = process.env.ADDRESS;
const FILTER_POST_UST = process.env.FILTER_POST_UST;

const filterPost = (data) => {
  const transactions = data.txs;
  const filterted =  []
   transactions.map(a => {
        if(a?.tx?.value?.msg[0].type == 'bank/MsgSend' && a?.tx?.value?.msg[0]?.value.amount[0].denom =='uusd' && (a?.tx?.value?.msg[0]?.value.amount[0].amount/UNIT) >= parseFloat(FILTER_POST_UST)){
            filterted.push(a);
        }
    })
    return filterted;
}

const formatPostData = (data) => {
    const posts = [];
    data.map(a=> {
        const memo = a?.tx?.value?.memo;
        if(memo){
            posts.push({memo, block:a?.height , txhash: a?.txhash, timestamp:a?.timestamp, from_address:a?.tx?.value?.msg[0]?.value.from_address, to_address:a?.tx?.value?.msg[0]?.value.to_address})
        }
    })
    return posts;
}

export const getPost = async (address:string) => {
  const query = `https://fcd.terra.dev/v1/txs?offset=0&limit=100&account=${ADDRESS}`;
  const postRequest = await fetchData(query)
  const filteredData =  filterPost(postRequest.data);
  const posts = formatPostData(filteredData);
  return {posts};
}
