import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { TEFI_PREVIEW_IMAGE } from '../constants';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
  render() {
    return (
      <Html>
        <Head>
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <link rel="manifest" href="/manifest.json" />
          <link href="/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
          <link href="/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />
          <link rel="icon" href="/favicon.ico?v=3" />
          <meta property="og:url" content="https://www.tefi.app/" />

          <link rel="apple-touch-icon" href="icons/icon.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="icons/152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="icons/180.png" />
          <link rel="apple-touch-icon" sizes="167x167" href="icons/167.png" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          {/* //Splash screen for ios  */}
          {/* <link href="/apple_splash_2048.png" sizes="2048x2732" rel="apple-touch-startup-image" />
          <link href="/apple_splash_1668.png" sizes="1668x2224" rel="apple-touch-startup-image" />
          <link href="/apple_splash_1536.png" sizes="1536x2048" rel="apple-touch-startup-image" />
          <link href="/apple_splash_1125.png" sizes="1125x2436" rel="apple-touch-startup-image" />
          <link href="/apple_splash_1242.png" sizes="1242x2208" rel="apple-touch-startup-image" />
          <link href="/apple_splash_750.png" sizes="750x1334" rel="apple-touch-startup-image" />
          <link href="/apple_splash_640.png" sizes="640x1136" rel="apple-touch-startup-image" /> */}

          <meta property="og:type" content="website" />
          <meta property="og:title" content={'TefiApp | Your portal to TeFi'} />
          <meta name="twitter:name" content={'TefiApp | Your portal to TeFi'} />
          <meta name="twitter:card" content="summary_large_image"></meta>
          <meta name="twitter:image" content={TEFI_PREVIEW_IMAGE} />
          <meta property="og:image" content={TEFI_PREVIEW_IMAGE} />
          <script async src={`https://www.googletagmanager.com/gtag/js?id=G-6Z0P6DM95C`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6Z0P6DM95C', {
            page_path: window.location.pathname,
            });
            `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
