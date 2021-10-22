import MIRROR_ASSETS from './mirrorAssets.json';
import { gql } from '@apollo/client';
import { request } from 'graphql-request';
import networks from '../../../utils/networks';
import { alias, parse, STAKING_CONTRACT } from './utils';

const STAKING_POOL = 'StakingPool';

const generate = ({ token }: ListedItem) => ({
  contract: STAKING_CONTRACT,
  msg: { pool_info: { asset_token: token } },
});

export const getStakingPool = async (): Promise<Dictionary<StakingPool>> => {
  try {
    const contractAssets = MIRROR_ASSETS.map((item: ListedItem) => ({ token: item.token, ...generate(item) }));
    const contractQuery = gql`
    query ${STAKING_POOL} {
      ${contractAssets.map(alias)}
    }
  `;

    const result = await request(networks.mainnet.mantle, contractQuery);
    const parsedData: Dictionary<StakingPool> = parse(result);
    return parsedData;
  } catch (err) {
    return null;
  }
};
