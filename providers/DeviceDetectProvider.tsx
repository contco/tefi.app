import React, { useState, useEffect, createContext, ReactNode } from 'react';

interface ContextProps {
  isMobile: boolean;
}

const Context = createContext<ContextProps>({
  isMobile: null,
});

interface Props {
  children: ReactNode;
}

const DeviceDetectProvider: React.FC<Props> = ({ children }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const getIsMobileDetect = async () => {
      const isMobile = (await import('react-device-detect'))?.isMobile;
      setIsMobile(isMobile);
    };
    getIsMobileDetect();
  }, []);

  return <Context.Provider value={{ isMobile }}>{children}</Context.Provider>;
};

export default DeviceDetectProvider;

export function useDeviceDetect(): ContextProps {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error('useDeviceDetect must be used within DeviceDetectProvider');
  }
  return context;
}
