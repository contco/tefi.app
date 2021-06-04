import MIRROR_ASSETS from './mirrorAssets.json';
import { gql } from '@apollo/client';
import { request } from 'graphql-request';
import networks from './networks';
import { alias, parse } from './utils';

const TOKEN_BALANCE = 'TokenBalance';

export const getTokenBalance = async (address: string) => {
  const generate = ({ token }: ListedItem) => {
    return { contract: token, msg: { balance: { address } } };
  };

  const assetBalancesQueries = MIRROR_ASSETS.map((item: ListedItem) => ({ token: item.token, ...generate(item) }));
  const balanceQuery = gql`
query ${TOKEN_BALANCE} {
  ${assetBalancesQueries.map(alias)}
}
`;

  let result = await request(networks.mainnet.mantle, balanceQuery);
  let parsedData: Dictionary<{ balance: string }> = parse(result);
  return parsedData;
};
