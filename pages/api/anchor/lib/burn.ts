/* eslint-disable no-useless-escape */
import axios from 'axios';
import { UNIT } from '../../mirror/utils';

const URL = 'https://mantle.anchorprotocol.com/';

const WITHDRAWABLE_REQUEST_QUERY = (address) =>
  `{\n  withdrawableUnbonded: WasmContractsContractAddressStore(\n    ContractAddress: \"terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts\"\n    QueryMsg: \"{\\\"withdrawable_unbonded\\\":{\\\"block_time\\\":1629097083,\\\"address\\\":\\\"${address}\\\"}}\"\n  ) {\n    Result\n  }\n  unbondedRequests: WasmContractsContractAddressStore(\n    ContractAddress: \"terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts\"\n    QueryMsg: \"{\\\"unbond_requests\\\":{\\\"address\\\":\\\"${address}\\\"}}\"\n  ) {\n    Result\n  }\n}\n`;

const ALL_HISTORY_QUERY =
  '{\n  allHistory: WasmContractsContractAddressStore(\n    ContractAddress: "terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts"\n    QueryMsg: "{\\"all_history\\":{\\"start_from\\":49,\\"limit\\":50}}"\n  ) {\n    Result\n  }\n  parameters: WasmContractsContractAddressStore(\n    ContractAddress: "terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts"\n    QueryMsg: "{\\"parameters\\":{}}"\n  ) {\n    Result\n  }\n}\n';

const valueConversion = (value) => value / UNIT  

export const getWithdrawableRequest = async (address) => {
  const withdrawables = await axios.get(URL + '?bond--withdrawable-requests', {
    params: {
      query: WITHDRAWABLE_REQUEST_QUERY(address),
      variables: {},
    },
  });

  const requests = JSON.parse(withdrawables.data?.data?.unbondedRequests.Result).requests;
  let requestAmounts = [];
  if (requests.length > 0) {
    requestAmounts = requests.map((request) => {
      return valueConversion(request[1]);
    });
  }
  const withdrawableAmount = JSON.parse(withdrawables?.data?.data.withdrawableUnbonded?.Result)?.withdrawable;

  return {
    requestAmounts,
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

  const histories = JSON.parse(history?.data?.data?.allHistory?.Result).history;

  if (histories.length > 0) {
    const exchangeRate = histories[0].applied_exchange_rate;
    const requestedTime = histories[0].time;
    const unbondingPeriod = JSON.parse(history?.data?.data?.parameters?.Result)?.unbonding_period;

    return {
      exchangeRate,
      requestedTime,
      unbondingPeriod,
    };
  } else {
    return {};
  }
};

export default async (address) => {
  const { requestAmounts } = await getWithdrawableRequest(address);
  return {
    requestAmounts,
  };
};
