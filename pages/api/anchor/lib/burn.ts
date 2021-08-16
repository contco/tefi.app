/* eslint-disable no-useless-escape */
import axios from 'axios';

const URL = 'https://mantle.anchorprotocol.com/';

const WITHDRAWABLE_REQUEST_QUERY = (address) =>
  `{\n  withdrawableUnbonded: WasmContractsContractAddressStore(\n    ContractAddress: \"terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts\"\n    QueryMsg: \"{\\\"withdrawable_unbonded\\\":{\\\"block_time\\\":1629097083,\\\"address\\\":\\\"${address}\\\"}}\"\n  ) {\n    Result\n  }\n  unbondedRequests: WasmContractsContractAddressStore(\n    ContractAddress: \"terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts\"\n    QueryMsg: \"{\\\"unbond_requests\\\":{\\\"address\\\":\\\"${address}\\\"}}\"\n  ) {\n    Result\n  }\n}\n`;

const ALL_HISTORY_QUERY = `{\n  allHistory: WasmContractsContractAddressStore(\n    ContractAddress: \"terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts\"\n    QueryMsg: \"{\\\"all_history\\\":{\\\"start_from\\\":49,\\\"limit\\\":100}}\"\n  ) {\n    Result\n  }\n  parameters: WasmContractsContractAddressStore(\n    ContractAddress: \"terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts\"\n    QueryMsg: \"{\\\"parameters\\\":{}}\"\n  ) {\n    Result\n  }\n}\n`;

export const getWithdrawableRequest = async (address) => {
  const withdrawables = await axios.get(URL + '?bond--withdrawable-requests', {
    params: {
      query: WITHDRAWABLE_REQUEST_QUERY(address),
      variables: {},
    },
  });

  const requests = JSON.parse(withdrawables.data?.data?.unbondedRequests.Result).requests;
  let requestAmount = '0';
  if (requests.length > 0) {
    requestAmount = requests[0][1];
  }
  const withdrawableAmount = JSON.parse(withdrawables?.data?.data.withdrawableUnbonded?.Result)?.withdrawable;

  return {
    requestAmount,
    withdrawableAmount,
  };
};

export const getAllHistory = async () => {
  const history = await axios.get(URL + '?bond--withdraw-history', {
    params: {
      query: ALL_HISTORY_QUERY,
      variables: {},
    },
  });

  const exchangeRate = JSON.parse(history?.data?.data?.allHistory?.Result).history[0].applied_exchange_rate;
  const requestedTime = JSON.parse(history?.data?.data?.allHistory.Result).history[0].time;
  const unbondingPeriod = JSON.parse(history?.data?.data?.parameters?.Result)?.unbonding_period;

  return {
    exchangeRate,
    requestedTime,
    unbondingPeriod,
  };
};
