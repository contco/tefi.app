import { fetchData } from '../commons';
import { formatTxData } from '../../../transactions/fetchTx';


const filterAndFormatPost = (data) => {
  const transactions = data.txs;
  const result = transactions.reduce((list, post) => {
      const transactionData = formatTxData(post);
      list = [...list, transactionData];
      return list;
  }, []);
  console.log(result)
  return result;
};


export const getTransaction = async (address,offset = 0, limit = 50) => {
  const query = `https://fcd.terra.dev/v1/txs?offset=${offset}&limit=${limit}&account=${address}`;
  const request = await fetchData(query);
  console.log('request', request);
  const next = request?.data?.next ?? false;
  const transactions = request?.data && filterAndFormatPost(request?.data);
  return {transactions, next};
};

export default async function handler(req, res) {
  const { address } = req.query
  console.log('address', address);
  const transactions = await getTransaction(address);
  res.status(200).json(transactions || []);
}
