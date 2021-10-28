import BUBBLE_DATA from '../../components/Bubble/images.json';
import { format } from 'date-fns';

const MINE_START_TIMESTAMP = 1625144400000;

export const formatChartData = (historicalData, symbol: string) => {
  let data = [...historicalData];
  if (symbol === 'mine') {
    data = historicalData.filter((item) => new Date(item.timestamp).getTime() > MINE_START_TIMESTAMP);
  }
  data = data
    .slice(0)
    .reverse()
    .map((item) => {
      const date = format(new Date(item?.timestamp), 'y-M-d');
      const value = item?.price.toFixed(4);
      return { date, value: parseFloat(value) };
    });
  return data;
};

export const formatHeatData = (pairData) => {
  let highest = 0;
  BUBBLE_DATA.forEach(({ symbol }: any) => {
    const change = pairData[symbol].dailyChangePercent;
    highest = change > highest ? change : highest;
  });
  return BUBBLE_DATA.map((a: any) => {
    const change = pairData[a.symbol].dailyChangePercent;
    const isPositive = pairData[a.symbol].dailyChange > 0;
    const size = change / highest;
    return {
      change: isPositive ? `${change?.toFixed(2)}%` : `-${change?.toFixed(2)}%`,
      size,
      isPositive: isPositive,
      ...a,
    };
  });
};
