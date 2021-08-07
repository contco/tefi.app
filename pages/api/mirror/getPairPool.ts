import MIRROR_ASSETS from './mirrorAssets.json';
import { gql } from '@apollo/client';
import { request } from 'graphql-request';
import networks from '../../../utils/networks';
import { alias, parse } from './utils';

const PAIR_POOL = 'PairPool';

const generate = ({ token, pair }: ListedItem) => {
  return { token, contract: pair, msg: { pool: {} } };
};

export const getPairPool = async () => {
  try {
  const contractAssets = MIRROR_ASSETS.map((item: ListedItem) => ({ token: item.token, ...generate(item) }));
  const contractQuery = gql`
    query ${PAIR_POOL} {
      ${contractAssets.map(alias)}
    }
  `;
  const result = await request(networks.mainnet.mantle, contractQuery);
  const parsedData: Dictionary<PairPool> & Dictionary<MintInfo> = parse(result);
  return parsedData;
  }
  catch(err){
    return null;
  }
};
