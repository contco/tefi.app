import axios from 'axios';
import {LCD_URL} from '../constants';

export const getLatestBlockHeight = async (lcdUrl = LCD_URL) => {
    const {data} = await axios.get( lcdUrl+ 'blocks/latest' );
    return data.block.header.height;
  };
  