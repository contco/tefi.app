import { gql } from '@apollo/client';
import { request } from 'graphql-request';
import networks from '../../../utils/networks';
import { gt, MIR, plus, UNIT} from './utils';

const STATS_NETWORK = 'Terra';
const MIRROR_TOKEN = "Mirror";

const AIRDROP = gql`
  query airdrop($address: String!, $network: String = "TERRA") {
    airdrop(address: $address, network: $network)
  }
`

export const getAirdrops = async (address: string) => {
  try {
  const variables = { address, network: STATS_NETWORK.toUpperCase() };
  const result = await request(networks.mainnet.stats, AIRDROP, variables);
  const airdrops = result?.airdrop.filter(({amount, claimable}) => gt(amount, 0) && claimable);
  return airdrops;
  }
  catch(err){
    return [];
  }
};

export const formatAirdrops = (airdrops, price:string) => {
  let airdropSum = '0';
  const contents = !airdrops?.length ? []
  :  airdrops.map((airdrop) => {
      const airdropQuantity  = parseFloat(airdrop?.amount) / UNIT;
      const airdropPrice = airdropQuantity * parseFloat(price);
      airdropSum = plus(airdropSum, airdropPrice);
      return ({ quantity: airdropQuantity.toString(), symbol: MIR, price: airdropPrice.toString(), name: MIRROR_TOKEN, round: airdrop.stage ?? 0  })
    });

  return {mirrorAirdrops: contents, airdropSum};
}
