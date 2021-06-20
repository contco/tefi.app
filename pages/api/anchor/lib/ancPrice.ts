import big from 'big.js';
import { ContractAddresses } from './test-defaults';
import { mantleFetch } from './utils';

export const ANC_PRICE_QUERY = `
  query ($ancUstPairContract: String!, $poolInfoQuery: String!) {
    ancPrice: WasmContractsContractAddressStore(
      ContractAddress: $ancUstPairContract
      QueryMsg: $poolInfoQuery
    ) {
      Result
    }
  }
`;

export const ancPriceQuery = async ( mantleEndpoint ) => {
  const rawData = await mantleFetch(
    ANC_PRICE_QUERY,
    {
      ancUstPairContract: ContractAddresses['ancUstPair'],
      poolInfoQuery: JSON.stringify({
        pool: {},
      }),
    },
    `${mantleEndpoint}?anc--price`,
  );

  const { assets, total_share } = JSON.parse(rawData?.ancPrice?.Result);

  const ANCPoolSize = assets[0].amount as unknown;
  const USTPoolSize = assets[1].amount as unknown;
  const LPShare = total_share as unknown;
  const ANCPrice = big(USTPoolSize)
    .div(+ANCPoolSize === 0 ? '1' : ANCPoolSize)
    .toString();

  return {
    ancPrice: {
      ANCPoolSize,
      USTPoolSize,
      LPShare,
      ANCPrice: ANCPrice.toLowerCase() === 'nan' ? '0' : ANCPrice,
    },
  };
};
