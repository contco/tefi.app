import { div } from "../../../../utils/math";
import { UNIT } from "../../mirror/utils";
import {getLoterraConfig} from "./config";
import {getLotteryDetails} from "./lotteryDetails";

const formatCombinations = (userCombinations) => {
    const combinationsString = userCombinations.reduce((str, item, index ) => {
        if(index === 0) {
            str = str + item;
        }
        else {
            str = str + ", " + item;
        }
        return str;

    }, "");
    return combinationsString;
}

export const getLoterraAccount = async (address: string) => {
    const loterraConfig = await getLoterraConfig();
    const {userCombinations, ticketCounts, jackpot} = await getLotteryDetails(address, loterraConfig?.lottery_counter);
   
    if(userCombinations && userCombinations.length > 0) {
        const combinations = formatCombinations(userCombinations);
        const ticketPrice = div(loterraConfig?.price_per_ticket_to_register, UNIT);
        const result = {combinations, ticketCounts, jackpot, drawTime: loterraConfig?.block_time_play.toString(), ticketPrice};
        return result;
    }
    return null;
}