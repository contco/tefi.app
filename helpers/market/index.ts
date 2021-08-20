import BUBBLE_DATA from '../../components/Bubble/images.json';
import {format} from 'date-fns';

const MINE_START_TIMESTAMP = 1625144400;
  
export const formatChartData = (historicalData, tokenKey: string, symbol: string) => {
    let data = [...historicalData];
      if(symbol === 'mine') {
         data = historicalData.filter((item) => item.timestamp  > MINE_START_TIMESTAMP);
      }
       data  = data
        .slice(0)
        .reverse()
        .map((item) => {
          const date = format(new Date(item?.timestamp * 1000), 'y-M-d');
          const value = parseFloat(item[`${tokenKey}Price`]).toFixed(4);
          return {date, value: parseFloat(value) }
        }
       );
       return data;
}

export const formatHeatData = (pairData) => {
  let highest = 0;
  BUBBLE_DATA.forEach(({ symbol }: any) => {
    const change = Math.abs(parseFloat(pairData[symbol].percentChange));
    highest = change > highest ? change : highest;
  });
  return BUBBLE_DATA.map((a: any) => {
    const change = parseFloat(pairData[a.symbol].percentChange);
    const changeP = Math.abs(change);
    const size = changeP / highest;
    return {
      change: `${change}%`,
      size,
      isPositive: change > 0,
      ...a,
    };
  });
};