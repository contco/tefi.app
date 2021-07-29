import { MARKET_DENOMS } from '@anchor-protocol/anchor.js';
import { anchor, blocksPerYear, ContractAddresses } from './test-defaults';
import { formatRate } from '@anchor-protocol/notation';
import {getLastSyncedHeight, mantleFetch } from './utils';
import { DEFAULT_MANTLE_ENDPOINTS } from '../../../../utils/ancEndpoints';


export const EARN_EPOCH_STATES_QUERY = `
  query (
    $moneyMarketContract: String!
    $moneyMarketEpochStateQuery: String!
    $overseerContract: String!
    $overseerEpochStateQuery: String!
  ) {
    moneyMarketEpochState: WasmContractsContractAddressStore(
      ContractAddress: $moneyMarketContract
      QueryMsg: $moneyMarketEpochStateQuery
    ) {
      Result
    }
    overseerEpochState: WasmContractsContractAddressStore(
      ContractAddress: $overseerContract
      QueryMsg: $overseerEpochStateQuery
    ) {
      Result
    }
  }
`;

export const getTotalDesposit = async ({ address }: any) => {
  const totalDesposit = await anchor.earn.getTotalDeposit({ market: MARKET_DENOMS.UUSD, address });
  return totalDesposit;
};

export const getAPY = async () => {

    const apy = await anchor.earn.getAPY({ market: MARKET_DENOMS.UUSD });
    return apy;

};

export async function earnEpochStatesQuery(mantleEndpoint) {
  try {
    const lastSyncedHeight = await getLastSyncedHeight();
    const rawData = await mantleFetch(
      EARN_EPOCH_STATES_QUERY,
      {
        moneyMarketContract: ContractAddresses['moneyMarket'],
        moneyMarketEpochStateQuery: JSON.stringify({
          epoch_state: {
            block_height: lastSyncedHeight,
          },
        }),
        overseerContract: ContractAddresses['overseer'],
        overseerEpochStateQuery: JSON.stringify({
          epoch_state: {},
        }),
      },
      `${mantleEndpoint}?earn--epoch-states`,
    );

    return {
      moneyMarketEpochState: JSON.parse(rawData?.moneyMarketEpochState?.Result),
      overseerEpochState: JSON.parse(rawData?.overseerEpochState?.Result),
    };
  } catch (err) {
    earnEpochStatesQuery(mantleEndpoint);
  }
}

export default async (address) => {
  const totalDesposit = await getTotalDesposit({ address });
  const earnEpoch = await earnEpochStatesQuery(DEFAULT_MANTLE_ENDPOINTS['mainnet']);
  const apy = parseFloat(earnEpoch?.overseerEpochState?.deposit_rate) * blocksPerYear;
  const result = {
    reward: {
      name: 'ANC Earn',
      apy: formatRate(apy),
      staked: totalDesposit,
    },
  };
  return result;
};
