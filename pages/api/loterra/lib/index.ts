import { div } from '../../../../utils/math';
import { UNIT } from '../../mirror/utils';
import { getLoterraConfig } from './config';
import { getLotteryDetails } from './lotteryDetails';
import { getLoterraStaking } from './staking';

const formatCombinations = (userCombinations) => {
  const combinationsString = userCombinations.reduce((str, item, index) => {
    if (index === 0) {
      str = str + item;
    } else {
      str = str + ', ' + item;
    }
    return str;
  }, '');
  return combinationsString;
};

export const getLoterraAccount = async (address: string) => {
  const [loterraConfig, lotaData] = await Promise.all([getLoterraConfig(), getLoterraStaking(address)]);
  const lotaGov = lotaData.GovStaking;
  const lotaPool = lotaData.lpStaking;
  console.log(lotaGov)
  const { userCombinations, ticketCounts, jackpot } = await getLotteryDetails(address, loterraConfig?.lottery_counter);
  if (userCombinations && userCombinations.length > 0) {
    const combinations = formatCombinations(userCombinations);
    const ticketPrice = div(loterraConfig?.price_per_ticket_to_register, UNIT);
    const drawTime = loterraConfig?.block_time_play * 1000;
    const loterraDraw = { combinations, ticketCounts, jackpot, drawTime: drawTime.toString(), ticketPrice };
    return { loterraDraw, lotaGov , lotaPool};
  }
  return { loterraDraw: null, lotaGov, lotaPool };
};
