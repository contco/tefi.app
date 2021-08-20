import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Bubble from '../../components/Bubble';
import BUBBLE_DATA from '../../components/Bubble/images.json';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Flex } from '@contco/core-ui';
import { fecthPairData } from '../../helpers/market/pairData';

const Container = styled(Flex)`
  ${css({
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '3vh',
    boxSizing: 'border-box',
    height: '90vh',
  })}
  width: 90%;
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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

  if (!Object.keys(data).length) return <Header theme={theme} changeTheme={changeTheme} />;

  useEffect(() => {
    const fecthData = async () => {
      try {
        const updatedData = await fecthPairData();
        Object.keys(updatedData).length && setData(formatData(updatedData));
      } catch (error) {}
    };
    fecthData();
  }, []);

  return (
    <>
      <Head>
        <title>Tefi App - Bubble</title>
      </Head>
      <Header theme={theme} changeTheme={changeTheme} />
      <MainContainer>
        <Container>
          <BubblesRow>
            {data.map(({ symbol, change, isPositive, size, imageUrl }: any) => (
              <Bubble key={symbol} price={change} isPostive={isPositive} size={size} imageUrl={imageUrl} />
            ))}
          </BubblesRow>
        </Container>
      </MainContainer>
    </>
  );
};

export async function getServerSideProps(_) {
  return {
    props: {
      pairData: await fecthPairData(),
    },
  };
}

export default HeatBubble;
