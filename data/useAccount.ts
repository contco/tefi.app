import useSWR from 'swr';
import axios from 'axios';
import { useMemo, useState } from 'react';
import { CLUB_SERVER_ROOT } from '../constants';
import { round } from 'mathjs';

const generateDashboardAssets = (assets) => {
  if (assets) {
    const assetsTotal = round(
      assets.reduce((sum, currentVal) => sum + currentVal.value, 0),
      5,
    );
    const sortedAssets = assets.sort((a, b) => b.value - a.value);
    const largerAssets = sortedAssets.filter((asset) => asset.value >= 1);
    const data = sortedAssets.map((asset: any) => {
      return [
        { symbol: asset.symbol },
        { name: asset.name },
        { value: round(asset.balance, 5) },
        { price: round(asset.price, 5) + ' USTC' },
        { value: round(asset.value, 5) + ' USTC' },
      ];
    });
    const largeData = largerAssets.map((asset: any) => {
      return [
        { symbol: asset.symbol },
        { name: asset.name },
        { value: round(asset.balance, 5) },
        { price: round(asset.price, 5) + ' USTC' },
        { value: round(asset.value, 5) + ' USTC' },
      ];
    });

    return {
      titles: ['Ticker', 'Name', 'Balance', 'Price', 'Value'],
      data: data,
      largeData: largeData,
      total: '$' + assetsTotal,
      totalValue: assetsTotal,
    };
  }
  return {};
};

export const useAccount = (address: string) => {
  const { data, error, mutate } = useSWR(address ? `${CLUB_SERVER_ROOT}/account/${address}` : null, axios);
  const [isRefetching, setRefetching] = useState<boolean>(false);
  const refetch = () => {
    if (!isRefetching) {
      setRefetching(true);
    }
    mutate();
  };
  const assets = useMemo(() => generateDashboardAssets(data?.data), [data?.data]);

  return {
    rawData: data?.data,
    assets,
    isLoading: !error && !data,
    isRefetching: !error && !data && isRefetching,
    isError: error,
    refetch: refetch,
  };
};
