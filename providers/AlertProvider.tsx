import React, { ReactNode, createContext, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TERRA_OBSERVER_URL } from '../constants';
import { getPrice } from '../pages/api/commons';
import { assets } from '../constants/assets';

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
    cancelAlert: () => {},
});

const AlertProvider: React.FC<Props> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alerts>({});
  const [realTimePriceList, setRealTimePriceList] = useState({});
  const audio = new Audio('/sounds/alert.wav');
  
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
   Object.keys(realTimePriceList).map((key: string) => {
      if(realTimePriceList[key] < alerts[key]?.price  && alerts[key]?.priceDirection !== PriceDirection.down) {
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
      else if (realTimePriceList[key] > alerts[key]?.price && alerts[key]?.priceDirection !== PriceDirection.up) {
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

  }, [realTimePriceList]);

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
            const newRealTimePrice = {...realTimePriceList, [key]: price};
            setRealTimePriceList(newRealTimePrice);
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
  }, [realTimePriceList]);

  const setPriceAlert = (symbol: string, price: string, currentPrice: string) => {
    currentPrice = realTimePriceList[symbol] ? realTimePriceList[symbol] : currentPrice;
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