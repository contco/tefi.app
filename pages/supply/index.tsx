import Header from '../../components/Header';
import Head from 'next/head';
import AssetSupply from '../../components/AssetSupply';

const Supply: React.FC = ({ theme, changeTheme }: any) => {
  return (
    <>
      <Head>
        <title>Tefi App - Asset Supply</title>
      </Head>
      <Header theme={theme} changeTheme={changeTheme} />
      <AssetSupply />
    </>
  );
};

export default Supply;
