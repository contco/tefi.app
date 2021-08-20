import React, { ReactNode, createContext, useState, useEffect } from 'react';
import { TERRA_OBSERVER_URL } from '../constants';
import { getPrice } from '../pages/api/commons';
import { assets } from '../constants/assets';

interface Prices {
  [key : string] : string;
}

interface ContextProps{
    realTimePrices: Prices;
}
interface Props {
  children: ReactNode;
}

const ObserverContext = createContext<ContextProps>({
  realTimePrices: null,
});

const TerraObserverProvider: React.FC<Props> = ({ children }) => {

  const [realTimePrices, setRealTimePrices] = useState<Prices>({});

  useEffect(() => {
    const ws = new WebSocket(TERRA_OBSERVER_URL);

    const connectWithTerraObserver = () => {
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

    return () => ws.close();
  }, [realTimePrices]);
 
  return (
    <ObserverContext.Provider value={{realTimePrices}}>
      {children}
    </ObserverContext.Provider>
  );
};

export default TerraObserverProvider;


export function useObserverContext(): ContextProps {
    const context = React.useContext(ObserverContext);
    if (context === undefined) {
      throw new Error('userObserverContext must be used within an TerraObserverProvider');
    }
    return context;
  }