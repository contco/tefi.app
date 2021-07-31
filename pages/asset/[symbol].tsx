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

export const StyledName = styled.p`
  ${(props) => ({
    color: props.theme.colors.secondary,
    fontSize: 26,
    fontWeight: 600,
  })}
`;

export const StyledPrice = styled.p`
  ${(props) => ({
    color: props.theme.colors.secondary,
    fontSize: 20,
    fontWeight: 600,
  })}
`;

export const StyledDate = styled.p`
  ${(props) => ({
    color: props.theme.colors.secondary,
    fontSize: 12,
    fontWeight: 600,
  })}
`;

export const SymbolsContainer = styled.div`
  width: 55%;
  display: flex;
  justify-content: space-between;
  padding-top: 50px;
`;

export const SymbolContainer: any = styled.div`
  padding: 10px;
  font-weight: ${(props: any) => (props.selected ? '900' : '400')};
  color: ${(props: any) => props.theme.colors.secondary};
  cursor: pointer;
`;

const renderTooltip = ({ payload }) => {
  const date = payload[0]?.payload?.date;
  return <StyledDate>{date}</StyledDate>;
};

const NamePrice = ({ price, name }) => {
  return (
    <div style={{ width: '55%' }}>
      <StyledName>{name}</StyledName>
      <StyledPrice>{`$${price}`}</StyledPrice>
    </div>
  );
};

const Symbol = ({ keyName, symbol }) => {
  const router = useRouter();

  return (
    <SymbolContainer
      onClick={() => {
        router.push(`/asset/${keyName}`, undefined, { shallow: true });
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
        <title>TefiApp</title>
      </Head>
      <Header theme={currentTheme} changeTheme={changeTheme} />
      <Container>
        <NamePrice price={price} name={data.name} />
        <ResponsiveContainer width="55%" height={263}>
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

export async function getStaticProps({ params }) {
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
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export default Home;
