import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { request } from 'graphql-request';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import styled, { useTheme } from 'styled-components';
import { GetStaticPaths } from 'next';
import Header from '../../components/Header';
import { AssetDetails } from '../../components/Market/AssetDetails';
import {GET_PAIRS_DATA} from '../../graphql/queries/getPairsData';
import { assets, DEFAULT_ASSETS_CURRENT_PRICE} from '../../constants/assets';
import { LIGHT_THEME, TERRA_OBSERVER_URL, TERRA_SWAP_GRAPHQL_URL } from '../../constants';
import { getTokenKey, formatChartData, getCurrentPairPrice} from '../../helpers/market';
import { subYears} from 'date-fns';
import { getPrice } from '../api/commons';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { NextSeo } from 'next-seo';
import { MarketSEO } from '../../next-seo.config';

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
  width: 55%;
  display: flex;
  justify-content: space-between;
  padding-top: ${(props: any) => props.useTV ? '30px' : '0px'};
  @media (max-width: 768px) {
    width: 85%;
  }
`;

const SymbolContainer: any = styled.div`
  padding-bottom: 13px;
  font-weight: 500;
  border-bottom: ${(props: any) => (props.selected ? `3px solid ${props.theme.colors.secondary}` : 'node')};
  color: ${(props: any) => props.theme.colors.secondary};
  cursor: pointer;
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

const Home: React.FC = ({ theme: currentTheme, changeTheme, pairData }: any) => {
  const theme: any = useTheme();
  const router = useRouter();
  const symbol = router.query.symbol as string;
  const [allPairsData, setAllPairsData] = useState<any>(pairData);
  const [data, setData]: any = useState(pairData?.[symbol]);
  const [price, setPrice] = useState(parseFloat(getCurrentPairPrice(pairData[symbol])));
  const [realTimePriceList, setRealTimePriceList] = useState<any>(DEFAULT_ASSETS_CURRENT_PRICE);
  const [priceChange, setPriceChange] = useState<PriceChange | null>(null);
  const [useTV, setUseTV] = useState<boolean>(false);

  const onMouseEnter = ({ isTooltipActive, activePayload }) => {
    if (isTooltipActive) setPrice(activePayload[0]?.payload.value);
  };

  const onMouseMove = ({ isTooltipActive, activePayload }) => {
    if (isTooltipActive) setPrice(activePayload[0]?.payload.value);
  };

  const updatePrice = () => {
    if (realTimePriceList[symbol]) {
      setPrice(parseFloat(realTimePriceList[symbol]));
    } else {
      const price = getCurrentPairPrice(pairData[symbol]);
      setPrice(parseFloat(price));
    }
  };

  const onMouseLeave = () => {
    updatePrice();
  };

  const updatePairData = (price: string, key: string) => {
    const pair = { ...allPairsData[key] };
    const newHistoricalData = [...pair?.historicalData];
    newHistoricalData[0][`${pair?.tokenKey}Price`] = price;

    const updatedPair = { ...pair, historicalData: newHistoricalData };
    setAllPairsData({ ...allPairsData, [key]: updatedPair });
    if (symbol === key) {
      setData(updatedPair);
    }
  };

  const calculateAndSetPriceChange = (pairData, realTimePrice) => {
    const currentPrice = realTimePrice ? realTimePrice :  getCurrentPairPrice(pairData);
    const dayOldPrice = pairData?.historicalData[1]?.[`${pairData.tokenKey}Price`];
    const change = parseFloat(currentPrice) - parseFloat(dayOldPrice);
    const percentChange = change / parseFloat(dayOldPrice)* 100;
    setPriceChange({change, percentChange});
  }

  useEffect(() => {
    setData(pairData[symbol]);
    calculateAndSetPriceChange(pairData[symbol], realTimePriceList[symbol])
    updatePrice();
  }, [symbol]);

  useEffect(() => {
    const ws = new WebSocket(TERRA_OBSERVER_URL);
    const connectWithTerraObserver = () => {
      ws.onopen = function () {
        ws.send(JSON.stringify({ subscribe: 'ts_pool', chain_id: 'columbus-4' }));
      };

      ws.onmessage = function (message) {
        const messageData = JSON.parse(message?.data);
        Object.keys(assets).map((key: string) => {
          if (assets?.[key]?.poolAddress === messageData?.data?.contract && messageData.chain_id === 'columbus-4') {
            const price = parseFloat(getPrice(messageData?.data?.pool)).toFixed(4);
            const newRealTimePrice = {...realTimePriceList, [key]: price};
            if(symbol === key)  {
              const pair = allPairsData[key];
              calculateAndSetPriceChange(pair, price);
              setPrice(parseFloat(price));
            };
            setRealTimePriceList(newRealTimePrice);
            updatePairData(price, key);
          }
        })
      }

      ws.onclose = function (_) {
        setTimeout(function () {
          connectWithTerraObserver();
        }, 1000);
      };
    };
    connectWithTerraObserver();

    return () => ws.close();
  }, [realTimePriceList, symbol]);

  const onSwitchTV = () => {
    if (!TV_SYMBOLS[symbol]) router.push('/market', undefined, { shallow: true });
    setUseTV((prev) => !prev);
  };
  return (
    <MainContainer>
      <NextSeo {...MarketSEO} />
      <Head>
      <title> TefiApp - Market | Coin Prices, Market Cap, 24 Hour Change</title>
      </Head>
      <Header theme={currentTheme} changeTheme={changeTheme} />
      <Container>
        <AssetDetails
          price={price}
          name={data.name}
          url={data.url}
          priceChange={priceChange}
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
                data={formatChartData(data?.historicalData, data?.tokenKey, symbol)}
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

export async function getStaticProps({ params: { symbol } }) {
  if (!assets[symbol])
    return {
      redirect: {
        destination: '/market/luna',
        permanent: false,
      },
    };

  const poolAddresses = Object.keys(assets).map((keyName) => assets[keyName].poolAddress);
  const toDate = new Date();
  const fromDate = subYears(toDate, 1);

  const { pairs } = await request(TERRA_SWAP_GRAPHQL_URL, GET_PAIRS_DATA, {
    from: fromDate.getTime() / 1000,
    to: toDate.getTime() / 1000,
    interval: 'DAY',
    pairAddresses: poolAddresses,
  });

  const data: any = {};

  Object.keys(assets).map((keyName: string, index: number) => {
    data[keyName] = { ...assets[keyName], ...pairs[index], tokenKey: getTokenKey(pairs[index], keyName) };
  });

  return {
    props: {
      pairData: data,
    },
    revalidate: 5,
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default Home;
