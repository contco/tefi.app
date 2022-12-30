import axios from "axios";
import {LCD_URL} from '../constants';

export const getLatestBlockTime = async (lcdUrl = LCD_URL) => {
    const {data} = await axios.get( lcdUrl+ 'blocks/latest' );;
    const blockTimeInMs = new Date(data.block.header.time).getTime();
    const blockTime = Math.round(blockTimeInMs / 1000);
    return blockTime;
};
  