import { gql } from '@apollo/client';
import {math, MICRO} from '@contco/terra-utilities';
import { request } from 'graphql-request';
import networks from '../../../utils/networks';
import { mirrorContracts } from './mirrorContracts';
import { MIR } from './utils';

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
  const airdrops = result?.airdrop.filter(({amount, claimable}) => math.gt(amount, 0) && claimable);
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
      const airdropQuantity  = parseFloat(airdrop?.amount) / MICRO;
      const value = airdropQuantity * parseFloat(price);
      airdropSum = math.plus(airdropSum, value);
      return ({quantity: airdropQuantity.toString(), symbol: MIR, value: value.toString(), name: MIRROR_TOKEN, round: airdrop.stage ?? 0,  proof: JSON.parse(airdrop.proof), contract: mirrorContracts.airdrop})
    });
  return {mirrorAirdrops: contents, airdropSum};
}
