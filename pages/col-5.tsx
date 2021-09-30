import Header from '../components/Header';
import Head from 'next/head';
import React from 'react';



const Col5: React.FC = ({ theme, changeTheme }: any) => {
  return (
    <>
      <Head>
        <title>Tefi App - Col-5 Update</title>
      </Head>
      <Header theme={theme} changeTheme={changeTheme} />

    </>
  );
};

export default Col5;

export async function getServerSideProps() {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }