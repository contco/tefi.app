import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import styled, { useTheme } from 'styled-components';
import { Flex } from '@contco/core-ui';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import { AssetDetails } from '../../components/Market/AssetDetails';
import { assets } from '../../constants/assets';
import { LIGHT_THEME } from '../../constants';
import { formatChartData } from '../../helpers/market';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { NextSeo } from 'next-seo';
import { MarketSEO } from '../../next-seo.config';
import { useAssetPriceContext } from '../../providers/AssetPriceProvider';

const TV_SYMBOLS = {
  luna: 'KUCOIN:LUNAUST',
  anc: 'KUCOIN:ANCUST',
  mir: 'KUCOIN:MIRUST',
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
`;

const ChartContainer = styled.p`
  width: 55%;
  height: 60vh;
  @media (max-width: 768px) {
    width: 85%;
    height: 50vh;
  }
  display: flex;
  align-items: center;
`;

const StyledDate = styled.p`
  ${(props) => ({
    color: props.theme.colors.secondary,
    fontSize: 12,
    fontWeight: 600,
  })}
`;

const SymbolsContainer: any = styled.div`
  width: 60%;
  display: flex;
  justify-content: space-between;
  padding-top: ${(props: any) => (props.useTV ? '30px' : '0px')};
  overflow: auto;
  min-height: 60px;
  @media (max-width: 768px) {
    width: 85%;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const SymbolContainer: any = styled.div`
  padding-bottom: 13px;
  font-weight: 500;
  border-bottom: ${(props: any) => (props.selected ? `3px solid ${props.theme.colors.secondary}` : 'node')};
  color: ${(props: any) => props.theme.colors.secondary};
  cursor: pointer;
  text-align: center;
  min-width: 56px;
  height: max-content;
  @media (max-width: 580px) {
    padding-bottom: 10px;
    font-weight: 500;
    font-size: 12px;
    min-width: 50px;
  }
  @media (max-width: 440px) {
    padding-bottom: 9px;
    font-weight: 500;
    font-size: 10px;
    min-width: 40px;
  }
`;

const LoadingContainer = styled(Flex)`
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
`;

const renderTooltip = ({ payload }) => {
  const date = payload[0]?.payload?.date;
  return <StyledDate>{date}</StyledDate>;
};

const Symbol = ({ keyName, symbol }) => {
  const router = useRouter();

  return (
    <SymbolContainer
      onClick={() => {
        router.push(`/market/${keyName}`, undefined, { shallow: true });
      }}
      selected={router.query.symbol == keyName}
    >
      {symbol}
    </SymbolContainer>
  );
};

const Home: React.FC = ({ theme: currentTheme, changeTheme }: any) => {
  const theme: any = useTheme();
  const router = useRouter();
  const symbol = router.query.symbol as string;
  const [price, setPrice] = useState(0);
  const [useTV, setUseTV] = useState<boolean>(false);
  const [currentAsset, setCurrentAsset] = useState(null);

  const { assetPriceData, assetsLoading } = useAssetPriceContext();

  useEffect(() => {
    if (assetPriceData?.[symbol]) {
      setPrice(parseFloat(assetPriceData[symbol]?.price.toFixed(4)));
      setCurrentAsset(assetPriceData[symbol]);
    }
  }, [assetPriceData]);

  useEffect(() => {
    if (assetPriceData) {
      setPrice(parseFloat(assetPriceData[symbol]?.price.toFixed(4)));
      setCurrentAsset(assetPriceData[symbol]);
    }
  }, [symbol]);

  const onMouseEnter = ({ isTooltipActive, activePayload }) => {
    if (isTooltipActive) setPrice(activePayload[0]?.payload.value);
  };

  const onMouseMove = ({ isTooltipActive, activePayload }) => {
    if (isTooltipActive) setPrice(activePayload[0]?.payload.value);
  };

  const onMouseLeave = () => {
    setPrice(parseFloat(currentAsset?.price.toFixed(4)));
  };

  const onSwitchTV = () => {
    if (!TV_SYMBOLS[symbol]) router.push('/market', undefined, { shallow: true });
    setUseTV((prev) => !prev);
  };
  if (assetsLoading || !currentAsset) {
    return (
      <LoadingContainer>
        <Loading currentTheme={currentTheme} />
      </LoadingContainer>
    );
  }

  return (
    <MainContainer>
      <NextSeo {...MarketSEO} />
      <Header theme={currentTheme} changeTheme={changeTheme} />
      <Container>
        <AssetDetails
          price={price}
          name={currentAsset?.symbol}
          url={currentAsset?.url}
          priceChange={{ change: currentAsset?.dailyChange, percentChange: currentAsset?.dailyChangePercent }}
          onSwitchTV={onSwitchTV}
          useTV={useTV}
        />
        <ChartContainer>
          {useTV ? (
            TV_SYMBOLS[symbol] && (
              <TradingViewWidget
                symbol={TV_SYMBOLS[symbol]}
                theme={currentTheme === LIGHT_THEME ? Themes.LIGHT : Themes.DARK}
                autosize
              />
            )
          ) : (
            <ResponsiveContainer width={'100%'} height={263}>
              <LineChart
                data={formatChartData(currentAsset?.historicalData, symbol)}
                onMouseEnter={onMouseEnter}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
              >
                <Line type="linear" dataKey="value" dot={false} stroke={theme.colors.secondary} strokeWidth={1.66} />
                <Tooltip
                  cursor={{ stroke: theme.colors.secondary, strokeWidth: 1 }}
                  content={renderTooltip}
                  isAnimationActive={false}
                  position={{ y: -20 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
        <SymbolsContainer useTV={useTV}>
          {Object.keys(assets).map((keyName) =>
            useTV ? (
              TV_SYMBOLS[keyName] && <Symbol key={keyName} keyName={keyName} symbol={assets[keyName].symbol} />
            ) : (
              <Symbol key={keyName} keyName={keyName} symbol={assets[keyName].symbol} />
            ),
          )}
        </SymbolsContainer>
      </Container>
    </MainContainer>
  );
};

export default Home;
