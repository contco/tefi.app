import { convertToFloatValue } from '../../../utils/convertFloat';

export const getAnchorBondData = (burn) => {
  const data = burn?.requestData.map((data: RequestData) => {
    return [
      {
        balance: {
          token: convertToFloatValue(data.amount.amount) + ' bLUNA',
          tokenValue: '$' + convertToFloatValue(data.amount.amountValue),
        },
      },
      {
        requestedTime: data.time.requestedTime || 'Pending',
      },
      {
        claimableTime: data.time.claimableTime || 'Pending',
      },
    ];
  });

  if (burn?.requestData.length <= 0) return {};

  return {
    titles: ['Amount', 'Request Time', 'Claimable Time'],
    data: data,
    total: [
      { name: 'Total', value: '$' + convertToFloatValue(burn?.totalBurnAmountValue) },
      {
        name: 'Withdrawable Amount',
        value: burn.withdrawableAmount + ' LUNA',
      },
    ],
  };
};
