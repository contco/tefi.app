import Header from '../../components/Header';
import Head from 'next/head';
import AssetSupply from '../../components/AssetSupply';
import { useSubscription } from '@apollo/client';
import { GET_ASSET_SUPPLY } from '../../graphql/queries/getAssetSupply';
import useAssetSupplyClient from '../../lib/assetSupplyClient';
import Loading from '../../components/Loading';

const Supply: React.FC = ({ theme, changeTheme }: any) => {
  const assetSupplyClient = useAssetSupplyClient();

  const { loading, error, data } = useSubscription(GET_ASSET_SUPPLY, {
    client: assetSupplyClient,
  });

  if (loading || error) {
    return <Loading height="90vh" width="100vw" />;
  }

  return (
    <>
      <Head>
        <title>Tefi App - Asset Supply</title>
      </Head>
      <Header theme={theme} changeTheme={changeTheme} />
      <AssetSupply assetSupply={data?.queryAssetSupply} />
    </>
  );
};

export default Supply;
