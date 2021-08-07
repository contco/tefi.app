import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import styled, { useTheme } from 'styled-components';
import { GetStaticPaths } from 'next';
import Header from '../../components/Header';
import { assets } from '../../constants/assets';
import { NewOpenIcon } from '../../components/Icons';

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
    width: 'max-content'
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

const NamePrice = ({ price, name, url }) => {
  return (
    <NamePriceContainer>
      <StyledName href={url} target="_blank">
        {name} <NewOpenIcon />
      </StyledName>
      <StyledPrice>{`$${price}`}</StyledPrice>
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

const formatData = (data) =>
  data.data
    .slice(0)
    .reverse()
    .map((item) => ({ date: item[0], value: parseFloat(item[1]) }));

const Home: React.FC = ({ theme: currentTheme, changeTheme, data: d }: any) => {
  const theme: any = useTheme();
  const router: any = useRouter();

  const [data, setData]: any = useState(d[router.query.symbol]);
  const [price, setPrice] = useState(parseFloat(data.currentPrice));

  useEffect(() => {
    const newData = d[router.query.symbol];
    setData(newData);
    setPrice(newData.chart.data[0][1]);
  }, [router.query.symbol]);

  const onMouseEnter = ({ isTooltipActive, activePayload }) => {
    if (isTooltipActive) setPrice(activePayload[0]?.payload.value);
  };

  const onMouseMove = ({ isTooltipActive, activePayload }) => {
    if (isTooltipActive) setPrice(activePayload[0]?.payload.value);
  };

  const onMouseLeave = () => {
    setPrice(parseFloat(data.currentPrice));
  };

  return (
    <MainContainer>
      <Head>
        <title>TefiApp - Markets</title>
      </Head>
      <Header theme={currentTheme} changeTheme={changeTheme} hideCharts />
      <Container>
        <NamePrice price={price} name={data.name} url={data.url} />
        <ChartContainer>
          <ResponsiveContainer width={'100%'} height={263}>
            <LineChart
              data={formatData(data.chart)}
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
          {Object.keys(assets).map((keyName, i) => (
            <Symbol keyName={keyName} symbol={assets[keyName].symbol} />
          ))}
        </SymbolsContainer>
      </Container>
    </MainContainer>
  );
};

const fetchData = async () => {
  return await Object.keys(assets).map(async (keyName, i) => {
    const res: any = await fetch(`https://alpac4.com/${assets[keyName].pair}_day.json?_vercel_no_cache=1`);
    const chart = await res.json();
    return { chart, ...assets[keyName], keyName, currentPrice: chart.data[0][1] };
  });
};

export async function getStaticProps({ params: { symbol } }) {
  if (!assets[symbol])
    return {
      redirect: {
        destination: '/market/luna',
        permanent: false,
      },
    };

  const allData = await fetchData();

  const all = await Promise.all(allData);

  const data: any = {};

  all.map((item) => {
    data[item.keyName] = item;
  });

  return {
    props: {
      data,
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
