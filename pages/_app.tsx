import React, { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import GlobalStyles from '../styles/global';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apolloClient';
import { ThemeProvider } from 'styled-components';
import WalletConnectProvider from '../providers/WalletConnectProvider';
import RedirectProvider from '../providers/RedirectProvider';
import Head from 'next/head';
import { DefaultSeo } from 'next-seo';

import { lightTheme, darkTheme } from '../styles/theme';
import { LIGHT_THEME, DARK_THEME, TEFI_PREVIEW_IMAGE } from '../constants';

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
      <DefaultSeo
        openGraph={{
          url: 'https://www.tefi.app/',
          type: 'website',
          title: 'TefiApp | Your portal to TeFi',
          description: '',
          images: [
            {
              url: TEFI_PREVIEW_IMAGE,
              width: 800,
              height: 600,
              alt: 'tefi-prewiew',
            },
          ],
        }}
        twitter={{
          handle: '@tefiapp',
          site: '@tefiapp',
          cardType: 'summary_large_image',
        }}
      />
      <Head>
        <title>Tefi App</title>
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
