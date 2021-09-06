import { fetchData } from '../commons';
import { UNIT } from '../mirror/utils';
import { formatTxData } from '../../../transactions/fetchTx';
const ADDRESS = 'terra1lpccq0w9e36nlzhx3m6t8pphx8ncavslyul29g';
const FILTER_POST_UST = '0.1';

const checkValidPost = (post) => {
  if(post?.tx?.value?.memo && post?.tx?.value?.msg[0].type == 'bank/MsgSend' && post?.tx?.value?.msg[0]?.value.amount[0].denom =='uusd' && (post?.tx?.value?.msg[0]?.value.amount[0].amount/UNIT) >= parseFloat(FILTER_POST_UST)){
    return true;
  }
  return false;
}

const filterAndFormatPost = (data) => {
  const transactions = data.txs;
  const result = transactions.reduce((postList, post) => {
    const isValid = checkValidPost(post);
    if (isValid){
      const postData = formatTxData(post);
      postList = [...postList, postData];
      return postList;
    }
    return postList;
  }, []);
  return result;
};


export const getTransaction = async (address,offset = 0, limit = 50) => {
  const query = `https://fcd.terra.dev/v1/txs?offset=${offset}&limit=${limit}&account=${address}`;
  const postRequest = await fetchData(query);
  console.log('postRequest', postRequest);
  const next = postRequest?.data?.next ?? false;
  const posts = postRequest?.data && filterAndFormatPost(postRequest?.data);
  return {posts, next};
};

export default async function handler(req, res) {
  console.log(req)
  const posts = await getTransaction('');
  res.status(200).json(posts || []);
}
