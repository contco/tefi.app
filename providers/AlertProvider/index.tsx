import React, { ReactNode, createContext, useState, useEffect } from 'react';
import {useRouter} from 'next/router';
import { useAssetPriceContext } from '../AssetPriceProvider';
import { askNotificationPermission } from './helpers';

const ALERT_KEY = 'alerts';
const CROSSING_UP = 'Up';
const CROSSING_DOWN = 'Down';

interface AlertContextProps{
    alerts: Alerts;
    setPriceAlert: (symbol: string, price: string, currentPrice: string) => void;
    cancelAlert: (symbol: string) => void;
    askNotificationPermission: () => Promise<boolean>
}
interface Props {
  children: ReactNode;
}

enum PriceDirection {
    up, 
    down,
}
interface Alerts {
    [key: string]: {
        price: string;
        priceDirection: PriceDirection
    }
}

const AlertContext = createContext<AlertContextProps>({
    alerts: null,
    setPriceAlert: () => null,
    cancelAlert: () => null,
    askNotificationPermission: () => null,
});

const AlertProvider: React.FC<Props> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alerts>({});
  const router  = useRouter();
  const audio = new Audio('/sounds/alert.wav');

  const {realTimePrices} = useAssetPriceContext();

  useEffect(() => {
        const alerts = JSON.parse(localStorage.getItem(ALERT_KEY));
        if(alerts) {
          setAlerts(alerts);
        }
  }, []);

  const updateLocalStorageState = (newAlerts: Alerts) => {
    localStorage.setItem(ALERT_KEY, JSON.stringify(newAlerts));
  };

  const displayPriceNotification = (price: string, symbol: string, direction: string) => {
     if (Notification.permission === 'granted') {
      audio.play();
      const image = window.location.origin + '/tefi.jpg';
      const text = `${symbol.toUpperCase()} Crossing ${direction} ${price}`;
      const notification = new Notification('Tefi Price Alert', { body: text , image});
      const url = '/market/' + symbol;
      notification.onclick = () => {
          window.focus();
          if(router.query.symbol !== symbol){
           router.push(url);
          }
      }
    }
  }

  useEffect(() => {
   Object.keys(realTimePrices).map((key: string) => {
      if(+realTimePrices[key] < +alerts[key]?.price  && alerts[key]?.priceDirection !== PriceDirection.down) {
        displayPriceNotification(alerts[key].price, key, CROSSING_DOWN);
        const newAlerts = {...alerts, [key]: {...alerts[key], priceDirection: PriceDirection.down}};
        setAlerts(newAlerts);
        updateLocalStorageState(newAlerts);
      }
      else if (+realTimePrices[key] > +alerts[key]?.price && alerts[key]?.priceDirection !== PriceDirection.up) {
        displayPriceNotification(alerts[key].price, key, CROSSING_UP);
        const newAlerts = {...alerts, [key]: {...alerts[key], priceDirection: PriceDirection.up}};
        setAlerts(newAlerts);
        updateLocalStorageState(newAlerts);
      }
   })

  }, [realTimePrices, alerts]);

  const setPriceAlert = async (symbol: string, price: string, currentPrice: string) => {
    currentPrice = realTimePrices[symbol] ? realTimePrices[symbol] : currentPrice;
    const currentDirection = parseFloat(currentPrice) > parseFloat(price) ? PriceDirection.up : PriceDirection.down;
    const newAlerts = {...alerts, [symbol]: {price, priceDirection: currentDirection}};
    setAlerts(newAlerts);
    updateLocalStorageState(newAlerts);
  }

  const cancelAlert = (symbol: string) => {
    const newAlerts = {...alerts};
    delete newAlerts[symbol];
    setAlerts(newAlerts);
    updateLocalStorageState(newAlerts);
  }

  return (
    <AlertContext.Provider value={{alerts, setPriceAlert, cancelAlert, askNotificationPermission}}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;


export function useAlertContext(): AlertContextProps {
    const context = React.useContext(AlertContext);
    if (context === undefined) {
      throw new Error('useAlertContext must be used within an AlertProvider');
    }
    return context;
  }