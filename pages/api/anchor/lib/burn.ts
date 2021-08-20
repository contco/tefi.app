/* eslint-disable no-useless-escape */
import axios from 'axios';
import { fetchData } from '../../commons';
import { secondsToDate, UNIT } from '../../mirror/utils';

const URL = 'https://mantle.anchorprotocol.com/';
const BASSETS_INFO = 'https://api.anchorprotocol.com/api/v1/bassets/';

const WITHDRAWABLE_REQUEST_QUERY = (address) =>
  `{\n  withdrawableUnbonded: WasmContractsContractAddressStore(\n    ContractAddress: \"terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts\"\n    QueryMsg: \"{\\\"withdrawable_unbonded\\\":{\\\"block_time\\\":1629097083,\\\"address\\\":\\\"${address}\\\"}}\"\n  ) {\n    Result\n  }\n  unbondedRequests: WasmContractsContractAddressStore(\n    ContractAddress: \"terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts\"\n    QueryMsg: \"{\\\"unbond_requests\\\":{\\\"address\\\":\\\"${address}\\\"}}\"\n  ) {\n    Result\n  }\n}\n`;

const ALL_HISTORY_QUERY = (number) =>
  `{\n  allHistory: WasmContractsContractAddressStore(\n    ContractAddress: "terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts"\n    QueryMsg: "{\\"all_history\\":{\\"start_from\\":${
    number - 1
  },\\"limit\\":${number}}}"\n  ) {\n    Result\n  }\n  parameters: WasmContractsContractAddressStore(\n    ContractAddress: "terra1mtwph2juhj0rvjz7dy92gvl6xvukaxu8rfv8ts"\n    QueryMsg: "{\\"parameters\\":{}}"\n  ) {\n    Result\n  }\n}\n`;

const valueConversion = (value) => value / UNIT;

export const getAllHistory = async (requestNumber: number) => {
  try {
    const history = await axios.get(URL + '?bond--withdraw-history', {
      params: {
        query: ALL_HISTORY_QUERY(requestNumber),
        variables: {},
      },
    });

    const histories = JSON.parse(history?.data?.data?.allHistory?.Result).history;

    if (histories.length > 0) {
      const exchangeRate = histories[0].applied_exchange_rate;
      const requestedTime = secondsToDate(histories[0].time);
      const unbondingPeriod = JSON.parse(history?.data?.data?.parameters?.Result)?.unbonding_period;
      const claimableTime = secondsToDate(histories[0].time + unbondingPeriod);

      return {
        exchangeRate,
        requestedTime,
        claimableTime,
      };
    } else {
      return {};
    }
  } catch (err) {
    return {};
  }
};

export const getWithdrawableRequest = async (address: string) => {
  try {
    const withdrawables = await axios.get(URL + '?bond--withdrawable-requests', {
      params: {
        query: WITHDRAWABLE_REQUEST_QUERY(address),
        variables: {},
      },
    });

    const requests = JSON.parse(withdrawables.data?.data?.unbondedRequests.Result).requests;
    let requestHistories = [];
    if (requests.length > 0) {
      requestHistories = await Promise.all(
        requests.map(async (request) => {
          const amount = valueConversion(request[1]).toString();
          const history = await getAllHistory(request[0]);
          const bLUNARequest = await fetchData(BASSETS_INFO + 'bluna');
          const bLunaPrice = bLUNARequest?.data?.bLuna_price;
          const totalValue = parseFloat(amount) * parseFloat(bLunaPrice);

          return {
            amount: {
              amount,
              amountValue: totalValue.toString(),
            },
            time: {
              requestedTime: history?.requestedTime,
              claimableTime: history?.claimableTime,
            },
          };
        }),
      );
    }

    const withdrawableAmount = JSON.parse(withdrawables?.data?.data.withdrawableUnbonded?.Result)?.withdrawable;

    return {
      requestHistories,
      withdrawableAmount: valueConversion(withdrawableAmount).toString(),
    };
  } catch (err) {
    return {
      requestHistories: [],
      withdrawableAmount: '0',
    };
  }
};

export default async (address) => {
  const { requestHistories, withdrawableAmount } = await getWithdrawableRequest(address);

  const totalBurnAmount = requestHistories.reduce((a, data) => a + parseFloat(data?.amount?.amount), 0).toString();
  const totalBurnAmountValue = requestHistories.reduce((a, data) => a + parseFloat(data?.amount?.amountValue), 0).toString();

  return {
    requestData: requestHistories,
    withdrawableAmount,
	totalBurnAmount,
	totalBurnAmountValue
  };
};
