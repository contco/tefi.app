
import {math, MICRO} from "@contco/terra-utilities";
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

const getLoterraDraw = (userCombinations, loterraConfig, ticketCounts, jackpot) => {
  if (userCombinations && userCombinations.length > 0) {
    const combinations = formatCombinations(userCombinations);
    const ticketPrice = math.div(loterraConfig?.price_per_ticket_to_register, MICRO);
    const drawTime = loterraConfig?.block_time_play * 1000;
    const loterraDraw = { combinations, ticketCounts, jackpot, drawTime: drawTime.toString(), ticketPrice };
    return loterraDraw;
  }
  return null;
};

export const getLoterraAccount = async (address: string) => {
  try {
    const [loterraConfig, lotaData] = await Promise.all([getLoterraConfig(), getLoterraStaking(address)]);
    const {lotaGov, lotaPool} = lotaData;
    const { userCombinations, ticketCounts, jackpot } = await getLotteryDetails(
      address,
      loterraConfig?.lottery_counter,
    );
    const loterraDraw = getLoterraDraw(userCombinations, loterraConfig, ticketCounts, jackpot);
    return { loterraDraw, lotaGov, lotaPool };
  } catch {
    return { loterraDraw: null, lotaGov: null, lotaPool: null };
  }
};
