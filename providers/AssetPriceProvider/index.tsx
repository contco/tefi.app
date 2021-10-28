import React, { ReactNode, createContext, useMemo } from 'react';
import { useSubscription } from '@apollo/client';
import { SUBSCRIBE_TOKEN_PRICE_DETAILS } from '../../graphql/queries/getPriceDetails';
import { useDgraphClient } from '../../lib/dgraphClient';

interface ContextProps {
  error: any;
  assetPriceData: any;
  assetsLoading: boolean;
}
interface Props {
  children: ReactNode;
}

const AssetPriceContext = createContext<ContextProps>({
  error: false,
  assetPriceData: null,
  assetsLoading: false,
});

const AssetPriceProvider: React.FC<Props> = ({ children }) => {
  const { data, loading, error } = useSubscription(SUBSCRIBE_TOKEN_PRICE_DETAILS, {
    variables: { order: { desc: 'timestamp' }, filter: { timeframe: { eq: '1d' } } },
    client: useDgraphClient(),
  });

  const assetPriceData = useMemo(() => {
    if (data?.queryTokenPriceDetails) {
      const assetPriceList = data.queryTokenPriceDetails.reduce((list, item) => {
        return { [item.symbol]: item, ...list };
      }, {});
      return assetPriceList;
    }
    return null;
  }, [data]);

  return (
    <AssetPriceContext.Provider value={{ assetsLoading: loading, assetPriceData, error }}>
      {children}
    </AssetPriceContext.Provider>
  );
};

export default AssetPriceProvider;

export function useAssetPriceContext(): ContextProps {
  const context = React.useContext(AssetPriceContext);
  if (context === undefined) {
    throw new Error('userAssetPriceContext must be used within an AssetPriceProvider');
  }
  return context;
}
