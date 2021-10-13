import { fetchData } from '../commons';
import { MICRO } from '@contco/terra-utilities';
import { formatTxData } from '../../../transactions/fetchTx';
import { FCD_URL } from '../utils';

const ADDRESS = 'terra1lpccq0w9e36nlzhx3m6t8pphx8ncavslyul29g';
const FILTER_POST_UST = '0.1';

const checkValidPost = (post) => {
  if(post?.tx?.value?.memo && post?.tx?.value?.msg[0].type == 'bank/MsgSend' && post?.tx?.value?.msg[0]?.value.amount[0].denom =='uusd' && (post?.tx?.value?.msg[0]?.value.amount[0].amount/MICRO) >= parseFloat(FILTER_POST_UST)){
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


export const getPost = async (offset = 0, limit = 100) => {
  const query = `${FCD_URL}v1/txs?offset=${offset}&limit=${limit}&account=${ADDRESS}`;
  const postRequest = await fetchData(query);
  const next = postRequest?.data?.next ?? false;
  const posts = postRequest?.data && filterAndFormatPost(postRequest?.data);
  return {posts, next};
};

export default async function handler(req, res) {
  const posts = await getPost();
  res.status(200).json(posts || []);
}
