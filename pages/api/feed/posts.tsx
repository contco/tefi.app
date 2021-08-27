import { fetchData } from '../commons';
import { UNIT } from '../mirror/utils';
import { formatTxData } from '../../../transactions/fetchTx';
const ADDRESS = process.env.ADDRESS;
const FILTER_POST_UST = process.env.FILTER_POST_UST;

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
      const postData  = formatTxData(post);
      postList = [...postList, postData];
      return postList;
    }
    return postList;
  }, []);
  return result;
};


export const getPost = async () => {
  const query = `https://fcd.terra.dev/v1/txs?offset=0&limit=100&account=${ADDRESS}`;
  const postRequest = await fetchData(query);
  const posts = filterAndFormatPost(postRequest.data);
  return posts;
};

export default async function handler(req, res) {
  const posts = await getPost();
  res.status(200).json(posts);
}
