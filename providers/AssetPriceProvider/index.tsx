import React, { ReactNode, createContext, useState, useEffect } from 'react';
import { TERRA_OBSERVER_URL } from '../../constants';
import { getPrice } from '../../pages/api/commons';
import { assets } from '../../constants/assets';
import {fetchPairData, updateAssetPriceData} from './helpers';

interface Prices {
  [key : string] : string;
}

interface ContextProps{
    realTimePrices: Prices;
    assetPriceData: any;
    assetsLoading: boolean;
}
interface Props {
  children: ReactNode;
}

const AssetPriceContext = createContext<ContextProps>({
  realTimePrices: null,
  assetPriceData: null,
  assetsLoading: false,
});

const AssetPriceProvider: React.FC<Props> = ({ children }) => {

  const [realTimePrices, setRealTimePrices] = useState<Prices>({});
  const [assetsLoading, setAssetsLoading] = useState<boolean>(true);
  const [assetPriceData, setAssetPriceData] = useState(null); 

  useEffect(() => {
    const getAssetsData = async () => {
      const data = await fetchPairData();
      setAssetPriceData(data);
      setAssetsLoading(false);
    } 
    getAssetsData();
  }, []);

  useEffect(() => {
    let ws;

    const connectWithTerraObserver = () => {
      ws = new WebSocket(TERRA_OBSERVER_URL);
      ws.onopen = function () {
        ws.send(JSON.stringify({ subscribe: 'ts_pool', chain_id: 'columbus-4' }));
      };

      ws.onmessage = function (message) {
        const messageData = JSON.parse(message?.data);
        Object.keys(assets).map((key: string) => {
          if (assets?.[key]?.poolAddress === messageData?.data?.contract && messageData.chain_id === 'columbus-4') {
            const price = parseFloat(getPrice(messageData?.data?.pool)).toFixed(4);
            const newRealTimePrice = {...realTimePrices, [key]: price};
            setRealTimePrices(newRealTimePrice);
            if(assetPriceData) {
            const newAssetPriceData = updateAssetPriceData(price, key, assetPriceData);
            setAssetPriceData(newAssetPriceData);
            }
          }
        })
      }

      ws.onclose = function (_) {
        setTimeout(function () {
          connectWithTerraObserver();
        }, 1000);
      };
    };

    connectWithTerraObserver();

    return () => ws?.close();
  }, [realTimePrices, assetPriceData]);

  return (
    <AssetPriceContext.Provider value={{assetsLoading, realTimePrices, assetPriceData}}>
      {children}
    </AssetPriceContext.Provider>
  );
};

export default AssetPriceProvider;


export function useAssetPriceContext(): ContextProps {
    const context = React.useContext(AssetPriceContext);
    if (context === undefined) {
      throw new Error('userAssetPriceContext must be used within an AssetPriceProvider');
    }
    return context;
  }