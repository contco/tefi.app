import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { request } from 'graphql-request';
import Header from '../../components/Header';
import Bubble from '../../components/Bubble';
import BUBBLE_DATA from '../../components/Bubble/images.json';
import { assets } from '../../constants/assets';
import { TERRA_SWAP_GRAPHQL_URL } from '../../constants';
import { getTokenKey } from '../../helpers/market';
import { GET_PAIRS_DATA } from '../../graphql/queries/getPairsData';
import { subYears } from 'date-fns';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Flex } from '@contco/core-ui';

const Container = styled(Flex)`
  ${css({
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 1,
    boxSizing: 'border-box',
    height: [400, 480, 520, 600, null, 860, '90vh'],
  })}
`;

const BubblesRow = styled(Flex)`
  ${css({
    margin: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
  })}
`;

const priceChange = (singalPairData) => {
  const dayCurrentPrice = singalPairData?.historicalData[0]?.[`${singalPairData.tokenKey}Price`];
  const dayOldPrice = singalPairData?.historicalData[1]?.[`${singalPairData.tokenKey}Price`];
  const change = parseFloat(dayCurrentPrice) - parseFloat(dayOldPrice);
  const percentChange = (change / parseFloat(dayOldPrice)) * 100;
  const roundOff = Math.abs(percentChange).toFixed(2);
  let signedPercentage = '1';
  if (percentChange < 0) {
    signedPercentage = (parseFloat(roundOff) * -1).toFixed(2);
  } else {
    signedPercentage = roundOff;
  }
  return signedPercentage;
};

const formatData = (pairData) => {
  let highest = 0;
  BUBBLE_DATA.forEach(({ symbol }: any) => {
    const change = Math.abs(parseFloat(priceChange(pairData[symbol])));
    highest = change > highest ? change : highest;
    console.log(change);
  });
  return BUBBLE_DATA.map((a: any) => {
    const change = parseFloat(priceChange(pairData[a.symbol]));
    const changeP = Math.abs(change);
    const size = changeP / highest;
    return {
      change: `${change}%`,
      size,
      isPositive: change > 0,
      ...a,
    };
  });
};

const HeatBubble: React.FC = ({ theme, changeTheme, pairData }: any) => {
  const [data, setData] = useState(formatData(pairData));

  useEffect(() => {
    const fecthData = async () => {
      try {
        const d = await getData();
        setData(formatData(d))
      } catch (error) {}
    };
    fecthData();
  }, []);

  return (
    <div>
      <Head>
        <title>Tefi App - Bubble</title>
      </Head>
      <div>
        <div>
          <Header theme={theme} changeTheme={changeTheme} />
        </div>
        <Container>
          <BubblesRow>
            {data.map(({ symbol, change, isPositive, size, imageUrl }: any) => (
              <Bubble key={symbol} price={change} isPostive={isPositive} size={size} imageUrl={imageUrl} />
            ))}
          </BubblesRow>
        </Container>
      </div>
    </div>
  );
};

const getData = async () => {
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

  return data;
};

export async function getServerSideProps(_) {
  return {
    props: {
      pairData: await getData(),
    },
  };
}

export default HeatBubble;
