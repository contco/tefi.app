import React, { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import GlobalStyles from '../styles/global';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apolloClient';
import { ThemeProvider } from 'styled-components';
import WalletConnectProvider from '../providers/WalletConnectProvider';
import RedirectProvider from '../providers/RedirectProvider';
import AlertProvider from '../providers/AlertProvider';
import Head from 'next/head';
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
    <Head>
          <title>Tefi App</title>
    </Head>
      <DefaultSeo {...SEO} />
      <ApolloProvider client={apolloClient}>    
        <ThemeProvider theme={theme === LIGHT_THEME ? lightTheme : darkTheme}>
          <GlobalStyles />
          <WalletConnectProvider>
            <RedirectProvider>
              <AlertProvider>
                <Component {...pageProps} theme={theme} changeTheme={changeTheme} />
              </AlertProvider>
            </RedirectProvider>
          </WalletConnectProvider>
        </ThemeProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
