import { gql } from '@apollo/client';
import { request } from 'graphql-request';
import networks from '../../../utils/networks';
import { gt, MIR, sum, formatAsset, times} from './utils';

const STATS_NETWORK = 'Terra';

const AIRDROP = gql`
  query airdrop($address: String!, $network: String = "TERRA") {
    airdrop(address: $address, network: $network)
  }
`

export const getAirdrops = async (address: string, price: string) => {
  const variables = { address, network: STATS_NETWORK.toUpperCase() };
  const result = await request(networks.mainnet.stats, AIRDROP, variables);
  const airdrops = result?.airdrop.filter(({amount}) => gt(amount, 0));

  const contents = !airdrops?.length ? []
  :  airdrops.map((airdrop) => {
      let airdropQuantity = formatAsset(airdrop?.amount, MIR);
      let airdropPrice = times(airdropQuantity, price ?? 0);
      return ({ quantity:airdropQuantity , price: airdropPrice, symbol: MIR, round: airdrop.stage ?? 0  })
    });
  return contents;
};
