import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { gql, request } from 'graphql-request';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import styled, { useTheme } from 'styled-components';
import { GetStaticPaths } from 'next';
import Header from '../../components/Header';
import { assets, DEFAULT_ASSETS_CURRENT_PRICE } from '../../constants/assets';
import { NewOpenIcon } from '../../components/Icons';
import { TERRA_OBSERVER_URL, TERRA_SWAP_GRAPHQL_URL } from '../../constants';
import { format, subYears } from 'date-fns';
import { getPrice } from '../api/commons';

const MINE_START_TIMESTAMP = 1625144400;

const TERRA_SWAP_QUERY = gql`
  query PairData($to: Float!, $from: Float!, $interval: Interval!, $pairAddresses: [String!]!) {
    pairs(pairAddresses: $pairAddresses) {
      pairAddress
      token0 {
        symbol
      }
      token1 {
        symbol
      }
      latestToken0Price
      latestToken1Price
      historicalData(to: $to, from: $from, interval: $interval) {
        timestamp
        token0Price
        token1Price
      }
    }
  }
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ChartContainer = styled.p`
  width: 55%;
  @media (max-width: 768px) {
    width: 85%;
  }
`;

const StyledName = styled.a`
  ${(props) => ({
    color: props.theme.colors.secondary,
    fontSize: 26,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    height: '30px',
    width: 'max-content',
  })}
  cursor: pointer;
`;

const StyledPrice = styled.p`
  ${(props) => ({
    color: props.theme.colors.secondary,
    fontSize: 20,
    fontWeight: 600,
  })}
`;

const StyledDate = styled.p`
  ${(props) => ({
    color: props.theme.colors.secondary,
    fontSize: 12,
    fontWeight: 600,
  })}
`;

const NamePriceContainer = styled.div`
  width: 55%;
  @media (max-width: 768px) {
    width: 85%;
  }
`;

const SymbolsContainer = styled.div`
  width: 55%;
  display: flex;
  justify-content: space-between;
  padding-top: 60px;
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

const NamePrice = ({ price, name, url, isPositive, shouldChangePriceColor }) => {
  const theme: any = useTheme();
  return (
    <NamePriceContainer>
      <StyledName href={url} target="_blank">
        {name} <NewOpenIcon />
      </StyledName>
      <div
        style={{
          height: '30px',
          display: 'flex',
        }}
      >
        <StyledPrice>{`$${price}`}</StyledPrice>
      </div>
    </NamePriceContainer>
  );
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

const getCurrentPairPrice = (pairData) => {
  const price = pairData?.historicalData[0]?.[`${pairData.tokenKey}Price`];
  return parseFloat(price).toFixed(4);
};

const formatChartData = (historicalData, tokenKey: string, symbol: string) => {
  let data = [...historicalData];
  if (symbol === 'mine') {
    data = historicalData.filter((item) => item.timestamp > MINE_START_TIMESTAMP);
  }
  data = data
    .slice(0)
    .reverse()
    .map((item) => {
      const date = format(new Date(item?.timestamp * 1000), 'y-M-d');
      const value = parseFloat(item[`${tokenKey}Price`]).toFixed(4);
      return { date, value: parseFloat(value) };
    });
  return data;
};

const Home: React.FC = ({ theme: currentTheme, changeTheme, pairData }: any) => {
  const theme: any = useTheme();
  const router = useRouter();
  const symbol = router.query.symbol as string;
  const [allPairsData, setAllPairsData] = useState<any>(pairData);
  const [data, setData]: any = useState(pairData?.[symbol]);
  const [price, setPrice] = useState(parseFloat(getCurrentPairPrice(pairData[symbol])));
  const [realTimePriceList, setRealTimePriceList] = useState<any>(DEFAULT_ASSETS_CURRENT_PRICE);
  const [shouldChangePriceColor, setShouldChangePriceColor] = useState<boolean>(false);
  const [isPositive, setPositive] = useState<boolean>(false);

  const onMouseEnter = ({ isTooltipActive, activePayload }) => {
    setShouldChangePriceColor(false);
    if (isTooltipActive) setPrice(activePayload[0]?.payload.value);
  };

  const onMouseMove = ({ isTooltipActive, activePayload }) => {
    setShouldChangePriceColor(false);
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

  const checkPositivePrice = (price: string, realTimePrice: string, pairPrice: string) => {
    if (realTimePrice) {
      return parseFloat(price) > parseFloat(realTimePrice);
    } else {
      return parseFloat(price) > parseFloat(pairPrice);
    }
  };

  const updatePairData = (price: string, key: string) => {
    const pair = { ...allPairsData[key] };
    const newHistoricalData = [...pair?.historicalData];
    newHistoricalData[0][`${pair?.tokenKey}Price`] = price;

    const updatedPair = { ...pair, historicalData: newHistoricalData, isPositive };
    setAllPairsData({ ...allPairsData, [key]: updatedPair });
    if (symbol === key) {
      setData(updatedPair);
    }
  };

  useEffect(() => {
    setData(pairData[symbol]);
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
            if (symbol === key) {
              const pair = allPairsData[key];
              const isPositive = checkPositivePrice(
                price,
                realTimePriceList[key],
                pair?.historicalData[0][`${pair?.tokenKey}Price`],
              );
              setPositive(isPositive);
              setShouldChangePriceColor(true);
              setPrice(parseFloat(price));
            }
            setRealTimePriceList({ ...realTimePriceList, [key]: price });
            updatePairData(price, key);
          }
        });
      };

      ws.onclose = function (_) {
        setTimeout(function () {
          connectWithTerraObserver();
        }, 1000);
      };
    };
    connectWithTerraObserver();

    return () => ws.close();
  }, [realTimePriceList, symbol]);

  return (
    <MainContainer>
      <Head>
        <title>TefiApp - Markets</title>
      </Head>
      <Header theme={currentTheme} changeTheme={changeTheme} hideCharts />
      <Container>
        <NamePrice
          price={price}
          name={data.name}
          url={data.url}
          isPositive={isPositive}
          shouldChangePriceColor={shouldChangePriceColor}
        />
        <ChartContainer>
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
                contentStyle={{ backgroundColor: 'red' }}
                content={renderTooltip}
                isAnimationActive={false}
                position={{ y: -20 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <SymbolsContainer>
          {Object.keys(assets).map((keyName) => (
            <Symbol key={keyName} keyName={keyName} symbol={assets[keyName].symbol} />
          ))}
        </SymbolsContainer>
      </Container>
    </MainContainer>
  );
};

const getTokenKey = (pairData, keyName: string) => {
  if (pairData?.token0?.symbol === assets[keyName].terraSwapSymbol) {
    return 'token0';
  } else {
    return 'token1';
  }
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

  const { pairs } = await request(TERRA_SWAP_GRAPHQL_URL, TERRA_SWAP_QUERY, {
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
