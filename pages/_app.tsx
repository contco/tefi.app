import React, { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import GlobalStyles from '../styles/global';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apolloClient';
import { ThemeProvider } from 'styled-components';
import WalletConnectProvider from '../providers/WalletConnectProvider';
import RedirectProvider from '../providers/RedirectProvider';
import Head from 'next/head';

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
    <ApolloProvider client={apolloClient}>
      <Head>
        <title>TefiApp</title>
        
        <meta name="apple-mobile-web-app-status-bar-style"  content={theme === LIGHT_THEME ? 'default' : ' black-translucent' } />

      </Head>
      <ThemeProvider theme={theme === LIGHT_THEME ? lightTheme : darkTheme}>
        <GlobalStyles />
        <WalletConnectProvider>
          <RedirectProvider>
            <Component {...pageProps} theme={theme} changeTheme={changeTheme} />
          </RedirectProvider>
        </WalletConnectProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;
