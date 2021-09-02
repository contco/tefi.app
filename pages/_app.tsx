import React, { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import GlobalStyles from '../styles/global';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apolloClient';
import { ThemeProvider } from 'styled-components';
import { WalletConnectProvider, RedirectProvider, AssetPriceProvider, DeviceDetectProvider, AssetsProvider, ModalProvider } from '../providers';
import { DefaultSeo } from 'next-seo';
import SEO from '../next-seo.config';

import { lightTheme, darkTheme } from '../styles/theme';
import { LIGHT_THEME, DARK_THEME } from '../constants';

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);
  const [theme, setTheme] = useState<string>(LIGHT_THEME);

  const changeTheme = () => {
    if (theme === LIGHT_THEME) {
      setTheme(DARK_THEME);
      localStorage.setItem('theme', DARK_THEME);
    } else {
      setTheme(LIGHT_THEME);
      localStorage.setItem('theme', LIGHT_THEME);
    }
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, []);

  return (
    <>
      <DefaultSeo {...SEO} />
      <ApolloProvider client={apolloClient}>    
        <ThemeProvider theme={theme === LIGHT_THEME ? lightTheme : darkTheme}>
          <GlobalStyles />
          <WalletConnectProvider>
            <RedirectProvider>
              <AssetPriceProvider>
                <DeviceDetectProvider>
                  <AssetsProvider>
                    <ModalProvider>
                      <Component {...pageProps} theme={theme} changeTheme={changeTheme} />
                    </ModalProvider>
                  </AssetsProvider>
                </DeviceDetectProvider>
              </AssetPriceProvider>
            </RedirectProvider>
          </WalletConnectProvider>
        </ThemeProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
