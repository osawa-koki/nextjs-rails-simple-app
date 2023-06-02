import React from 'react';
import { AppProps } from 'next/app';

import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/styles.scss';
import '../styles/menu.scss';

import '../styles/index.scss';
import '../styles/about.scss';
import '../styles/contact.scss';

import Head from 'next/head';

import setting from '../setting';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>{setting.title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/png" href={`${setting.basePath}/favicon.ico`} />
      </Head>
      <Component {...pageProps} />
    </>
  );
};
