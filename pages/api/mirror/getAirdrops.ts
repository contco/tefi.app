import { gql } from '@apollo/client';
import { request } from 'graphql-request';
import networks from '../../../utils/networks';
import { gt, MIR, plus, formatAsset, times} from './utils';

const STATS_NETWORK = 'Terra';
const MIRROR_TOKEN = "Mirror";

const AIRDROP = gql`
  query airdrop($address: String!, $network: String = "TERRA") {
    airdrop(address: $address, network: $network)
  }
`

export const getAirdrops = async (address: string) => {
  const variables = { address, network: STATS_NETWORK.toUpperCase() };
  const result = await request(networks.mainnet.stats, AIRDROP, variables);
  const airdrops = result?.airdrop.filter(({amount}) => gt(amount, 0));
  return airdrops;
};

export const formatAirdrops = (airdrops, price:string) => {
  let airdropSum = '0';
  const contents = !airdrops?.length ? []
  :  airdrops.map((airdrop) => {
      const airdropQuantity = formatAsset(airdrop?.amount, MIR);
      const airdropPrice = times(airdropQuantity, price ?? 0);
      airdropSum = plus(airdropSum, airdropPrice);
      return ({ quantity:airdropQuantity , price: airdropPrice, name: MIRROR_TOKEN, round: airdrop.stage ?? 0  })
    });

  return {mirrorAirdrops: contents, airdropSum};
}
