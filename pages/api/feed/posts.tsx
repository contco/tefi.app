import { MICRO } from '@contco/terra-utilities';
import { formatTxData } from '../../../transactions/fetchTx';
import { FCD_URL } from '../utils';
import axios from 'axios';

//const ADDRESS = 'terra1lpccq0w9e36nlzhx3m6t8pphx8ncavslyul29g';
const CLUB_SERVER_ROOT = 'https://tef-club-server.herokuapp.com/';
const FILTER_POST_UST = '0.1';

const checkValidPost = (post) => {
  if (
    post?.tx?.value?.memo &&
    post?.tx?.value?.msg[0].type == 'bank/MsgSend' &&
    post?.tx?.value?.msg[0]?.value.amount[0].denom == 'uusd' &&
    post?.tx?.value?.msg[0]?.value.amount[0].amount / MICRO >= parseFloat(FILTER_POST_UST)
  ) {
    return true;
  }
  return false;
};

const filterAndFormatPost = (data) => {
  const transactions = data.txs;
  const result = transactions.reduce((postList, post) => {
    const isValid = checkValidPost(post);
    if (isValid) {
      const postData = formatTxData(post);
      postList = [...postList, postData];
      return postList;
    }
    return postList;
  }, []);
  return result;
};

export const getPost = async (offset = 0, limit = 100) => {
  try {
    const query = `${CLUB_SERVER_ROOT}posts?offset=${offset}&limit=${limit}`;
    const postRequest = await axios.get(query, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    const next = postRequest?.data?.next ?? false;
    const posts = postRequest?.data && filterAndFormatPost(postRequest?.data);
    return { posts, next };
  } catch (err) {
    return { posts: [], next: false };
  }
};

export default async function handler(req, res) {
  try {
    const posts = await getPost();
    res.status(200).json(posts ?? []);
  } catch (err) {
    res.status(500).json([]);
  }
}
