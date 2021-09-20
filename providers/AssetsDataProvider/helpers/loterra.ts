import { convertToFloatValue } from '../../../utils/convertFloat';

export const getLoterraData = (loterra) => {
  if (!loterra?.loterraDraw) {
    return {};
  }

  return {
    titles: ['User Combinations', 'Tickets Sold', 'Draw End Time', 'Latest Jackpot'],
    data: [
      [
        { name: loterra?.loterraDraw?.combinations },
        { value: loterra?.loterraDraw?.ticketCounts },
        {
          drawTime: parseFloat(loterra?.loterraDraw?.drawTime),
        },
        {
          value: '$' + convertToFloatValue(loterra?.loterraDraw?.jackpot),
        },
      ],
    ],
    total: null,
  };
};
