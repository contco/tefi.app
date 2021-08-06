import { gql } from '@apollo/client';
import { request } from 'graphql-request';
import networks from '../../../utils/networks';

const STATS_NETWORK = 'Terra';

const ASSETSTATS = gql`
  query assets($network: Network) {
    assets {
      token
      description
      statistic {
        liquidity(network: $network)
        volume(network: $network)
        apr {
          long 
          short
        }
      }
    }
    statistic {
      govAPR
      mirPrice
    }
  }
`;

export const getAssetsStats = async () => {
  try {
  const variables = { network: STATS_NETWORK.toUpperCase() };
  const result = await request(networks.mainnet.stats, ASSETSTATS, variables);
  const apr = result.assets.reduce((acc: any, { token, statistic }) => {
    return { ...acc, [token]: statistic.apr.long };
  }, {});
  return {apr, statistic: result?.statistic};
  }
  catch(err) {
    return null;
  } 
};
