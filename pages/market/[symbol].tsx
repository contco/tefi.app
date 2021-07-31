import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';

import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import styled, { useTheme } from 'styled-components';
import { GetStaticPaths } from 'next';

const assets = {
  luna: {
    pair: 'LUNA-UST',
    name: 'Terra LUNA',
    symbol: 'LUNA',
  },
  anc: {
    pair: 'ANC-UST',
    name: 'Anchor Protocol',
    symbol: 'ANC',
  },
  mir: {
    pair: 'MIR-UST',
    name: 'Mirror Protocol',
    symbol: 'MIR',
  },
  mine: {
    pair: 'MINE-UST',
    name: 'Pylon Protocol',
    symbol: 'MINE',
  },
  spec: {
    pair: 'SPEC-UST',
    name: 'Spectrum Protocol',
    symbol: 'SPEC',
  },
  lota: {
    pair: 'LOTA-UST',
    name: 'LoTerra',
    symbol: 'LOTA',
  },
};

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
`;

const ChartContainer = styled.p`
  width: 55%;
  @media (max-width: 768px) {
    width: 85%;
  }
`;

const StyledName = styled.p`
  ${(props) => ({
    color: props.theme.colors.secondary,
    fontSize: 26,
    fontWeight: 600,
  })}
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
  text-shadow: 0 0 0.01px black, 0 0 0.01px black, 0 0 0.01px black;
`;

const renderTooltip = ({ payload }) => {
  const date = payload[0]?.payload?.date;
  return <StyledDate>{date}</StyledDate>;
};

const NamePrice = ({ price, name }) => {
  return (
    <NamePriceContainer>
      <StyledName>{name}</StyledName>
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

  console.log(d[router.query.symbol]);

  const [data, setData] = useState(d[router.query.symbol]);

  const currentPrice = parseFloat(data.chart.data[0][1]);

  const [price, setPrice] = useState(currentPrice);

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
    setPrice(currentPrice);
  };

  return (
    <div>
      <Head>
        <title>TefiApp - Markets</title>
      </Head>
      <Header theme={currentTheme} changeTheme={changeTheme} />
      <Container>
        <NamePrice price={price} name={data.name} />
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
    </div>
  );
};

const fetchData = async (pair) => {
  const res = await fetch(`https://alpac4.com/${pair}_day.json`);
  return await res.json();
};

export async function getStaticProps({ params: { symbol } }) {
  if (!assets[symbol])
    return {
      redirect: {
        destination: '/market/luna',
        permanent: false,
      },
    };

  const allData = await Object.keys(assets).map(async (keyName, i) => {
    const chart = await fetchData(assets[keyName].pair);
    return { chart, ...assets[keyName], keyName };
  });

  const all = await Promise.all(allData);

  const data = {};

  all.map((item) => {
    data[item.keyName] = item;
  });

  return {
    props: {
      data,
    },
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default Home;
