import { useRouter } from 'next/router';
import { useEffect, FC, ReactChildren, ReactChild, ReactNode } from 'react';
import useWallet from '../lib/useWallet';
import { ADDRESS_KEY } from '../constants';

interface RedirectProviderProps {
  children: ReactChild | ReactChildren | ReactNode;
}

const RedirectProvider: FC<RedirectProviderProps> = ({ children }) => {
  const { useConnectedWallet } = useWallet();
  const connectedWallet = useConnectedWallet();
  const router = useRouter();

  useEffect(() => {
    const localAddress = localStorage.getItem(ADDRESS_KEY);

    if (router.pathname === '/') {
      if (localAddress || connectedWallet?.terraAddress) {
        router.push('/dashboard');
      }
    } else if (router.pathname === '/dashboard') {
      if (!localAddress && !connectedWallet?.terraAddress) {
        router.push('/');
      }
    }
  }, [connectedWallet, router.pathname]);

  return <>{children}</>;
};

export default RedirectProvider;
