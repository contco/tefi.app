import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Bubble from '../../components/Bubble';
import Loading from '../../components/Loading';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Flex } from '@contco/core-ui';
import { formatHeatData } from '../../helpers/market';
import { useAssetPriceContext } from '../../providers/AssetPriceProvider';

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

const LoadingContainer = styled(Flex)`
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
`;

const HeatBubble: React.FC = ({ theme, changeTheme }: any) => {
  const [data, setData] = useState(null);
  const { assetPriceData, assetsLoading } = useAssetPriceContext();

  useEffect(() => {
    if (assetPriceData) {
      setData(formatHeatData(assetPriceData));
    }
  }, [assetPriceData]);

  if (assetsLoading) {
    return (
      <LoadingContainer>
        <Loading currentTheme={theme} />
      </LoadingContainer>
    );
  }

  if (!data) return <Header theme={theme} changeTheme={changeTheme} />;

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

export default HeatBubble;
