import React, { ReactNode, createContext, useState, useEffect } from 'react';
import {useRouter} from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAssetPriceContext } from '../AssetPriceProvider';
import { askNotificationPermission } from './helpers';

const ALERT_KEY = 'alerts';

interface AlertContextProps{
    alerts: Alerts;
    setPriceAlert: (symbol: string, price: string, currentPrice: string) => void;
    cancelAlert: (symbol: string) => void;
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
});

const AlertProvider: React.FC<Props> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alerts>({});
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const router  = useRouter();
  const audio = new Audio('/sounds/alert.wav');

  const {realTimePrices} = useAssetPriceContext();

  useEffect(() => {
    const onFocus = () => setIsFocused(true);
    const onBlur = () => setIsFocused(false);
   
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
        window.removeEventListener('focus', onFocus);
        window.removeEventListener('blur', onBlur);
    }
  });

  useEffect(() => {
        const alerts = JSON.parse(localStorage.getItem(ALERT_KEY));
        if(alerts) {
          setAlerts(alerts);
        }
  }, []);

  const updateLocalStorageState = (newAlerts: Alerts) => {
    localStorage.setItem(ALERT_KEY, JSON.stringify(newAlerts));
  };

  const displayPriceNotification = (notificationType, price, symbol) => {
    audio.play();
    if(document.visibilityState === 'visible' && isFocused) {
    toast[notificationType](`${symbol} Crossing ${price}`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
    else if (Notification.permission === 'granted') {
      const img = window.location.origin + '/tefi.jpg';
      const text = `${symbol} Crossing ${price}`;
      const notification = new Notification('Tefi Price Alert', { body: text, icon: img });
      notification.onclick = () => {
          window.focus();
          if(router.query.symbol !== symbol){
           router.push('/market/' + symbol);
          }
      }
    }
  }

  useEffect(() => {
   Object.keys(realTimePrices).map((key: string) => {
      if(realTimePrices[key] < alerts[key]?.price  && alerts[key]?.priceDirection !== PriceDirection.down) {
        const symbol = key.toUpperCase();
        displayPriceNotification('error', alerts[key].price, symbol);
        const newAlerts = {...alerts, [key]: {...alerts[key], priceDirection: PriceDirection.down}};
        setAlerts(newAlerts);
        updateLocalStorageState(newAlerts);
      }
      else if (realTimePrices[key] > alerts[key]?.price && alerts[key]?.priceDirection !== PriceDirection.up) {
        const symbol = key.toUpperCase();
        displayPriceNotification('success', alerts[key].price, symbol);
        const newAlerts = {...alerts, [key]: {...alerts[key], priceDirection: PriceDirection.up}};
        setAlerts(newAlerts);
        updateLocalStorageState(newAlerts);
      }
   })

  }, [realTimePrices]);

  const setPriceAlert = async (symbol: string, price: string, currentPrice: string) => {
    const isDesktopNotifyAllowed = await askNotificationPermission();
    if(!isDesktopNotifyAllowed) {
        toast.info(`Please allow notifications for Price Alerts`, {
            position: "top-left",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            });
    }
    currentPrice = realTimePrices[symbol] ? realTimePrices[symbol] : currentPrice;
    const currentDirection = +currentPrice > +price ? PriceDirection.up : PriceDirection.down;
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
    <AlertContext.Provider value={{alerts, setPriceAlert, cancelAlert}}>
      {children}
      <ToastContainer />
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