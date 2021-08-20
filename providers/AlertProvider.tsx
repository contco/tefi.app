import React, { ReactNode, createContext, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useObserverContext } from './TerraObserverProvider';

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
  const audio = new Audio('/sounds/alert.wav');

  const {realTimePrices} = useObserverContext();

  useEffect(() => {
        const alerts = JSON.parse(localStorage.getItem(ALERT_KEY));
        if(alerts) {
          setAlerts(alerts);
        }
  }, []);

  const updateLocalStorageState = (newAlerts: Alerts) => {
    localStorage.setItem(ALERT_KEY, JSON.stringify(newAlerts));
  };

  useEffect(() => {
   Object.keys(realTimePrices).map((key: string) => {
      if(realTimePrices[key] < alerts[key]?.price  && alerts[key]?.priceDirection !== PriceDirection.down) {
        const symbol = key.toUpperCase();
        audio.play()
        toast.error(`${symbol} Crossing ${alerts[key].price} `, {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
         const newAlerts = {...alerts, [key]: {...alerts[key], priceDirection: PriceDirection.down}};
         setAlerts(newAlerts);
         updateLocalStorageState(newAlerts);
      }
      else if (realTimePrices[key] > alerts[key]?.price && alerts[key]?.priceDirection !== PriceDirection.up) {
        const symbol = key.toUpperCase();
        audio.play();
        toast.success(`${symbol} Crossing ${alerts[key].price} `, {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });
        const newAlerts = {...alerts, [key]: {...alerts[key], priceDirection: PriceDirection.up}};
        setAlerts(newAlerts);
        updateLocalStorageState(newAlerts);
      }
   })

  }, [realTimePrices]);

  const setPriceAlert = (symbol: string, price: string, currentPrice: string) => {
    currentPrice = realTimePrices[symbol] ? realTimePrices[symbol] : currentPrice;
    const currentDirection = +currentPrice > +price ? PriceDirection.up : PriceDirection.down;
    const newAlerts = {...alerts, [symbol]: {price, priceDirection: currentDirection}};
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