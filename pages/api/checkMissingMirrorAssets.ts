import MIRROR_ASSETS from './mirror/mirrorAssets.json';
import { differenceWith } from 'lodash';
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
import networks from '../../utils/networks';

const compareFunction = (item1, item2) => {
  if (item1.status === 'DELISTED') {
    return true;
  } else if (item1.token === item2.token) {
    return true;
  }
  return false;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { data } = await axios.get(networks.mainnet.contract);
  const whiteList = Object.values(data?.whitelist);
  const missingTokens = differenceWith(whiteList, MIRROR_ASSETS, compareFunction);
  res.status(200).json(missingTokens);
}
