import { fetchData } from '../commons';
import { formatTxData } from '../../../transactions/fetchTx';

const checkFailure = (trans) => {
  if(trans?.code === 5){
    return true;
  }
  return false;
}

const filterAndFormatTx = (data) => {
  const transactions = data.txs;
  const result = transactions.reduce((list, trans) => {
    const isFail = checkFailure(trans);
    if(!isFail){
      const transactionData = formatTxData(trans);
      list = [...list, transactionData];
      return list;
    }   
    return list;
  }, []);
  return result;
};

export const getTransaction = async (address,offset = 0, limit = 100) => {
  const query = `https://fcd.terra.dev/v1/txs?offset=${offset}&limit=${limit}&account=${address}`;
  const request = await fetchData(query);
  const next = request?.data?.next ?? false;
  const transactions = request?.data && filterAndFormatTx(request?.data);
  return {transactions, next};
};

export default async function handler(req, res) {
  const { address } = req.query
  const transactions = await getTransaction(address);
  res.status(200).json(transactions || []);
}
