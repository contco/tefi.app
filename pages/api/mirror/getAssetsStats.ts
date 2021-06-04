import {gql} from "@apollo/client"; 
import {request} from "graphql-request";
import networks from "./networks";


const STATS_NETWORK = "Terra";

const ASSETSTATS = gql`
  query assets($network: Network) {
    assets {
      token
      description
      statistic {
        liquidity(network: $network)
        volume(network: $network)
        apr
        apy
      }
    }
  }
`;

export const getAssetsStats = async () => {
    const variables = {network: STATS_NETWORK.toUpperCase()};
    let result = await request(networks.mainnet.stats, ASSETSTATS, variables);
    const apr = result.assets.reduce((acc: any, { token, statistic }) => {
        return { ...acc, [token]: statistic.apr }
      }, {});
    return apr;
}