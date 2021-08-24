import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';
import styled, { useTheme } from 'styled-components';
import { GetStaticPaths } from 'next';
import Header from '../../components/Header';
import { AssetDetails } from '../../components/Market/AssetDetails';
import { assets } from '../../constants/assets';
import { LIGHT_THEME } from '../../constants';
import { formatChartData } from '../../helpers/market';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { NextSeo } from 'next-seo';
import { MarketSEO } from '../../next-seo.config';
import { fetchPairData } from '../../providers/AssetPriceProvider/helpers/pairData';
import { useAssetPriceContext } from '../../providers/AssetPriceProvider'
import { formatNavigationData } from '../../helpers/market';
import css from '@styled-system/css';
import { Flex } from '@contco/core-ui';

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
  height: 50vh;
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

const ChartNavigationContainer: any = styled(Flex)`
  width: 56%;
  justify-content: space-between;
  padding-top: ${(props: any) => (props.useTV ? '40px' : '0px')};
  @media (max-width: 768px) {
    width: 95%;
  }
  overflow-y: auto;
  
`;

const ChartIconCards: any = styled(Flex)`
${(props :any) =>
  css({
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems:'center',
    textAlign:'center',
    bg: props.selected? props.theme.colors.activeState : 'background',
    height: 105,
    width:70,
    padding:2,
    borderRadius:'8px',
    boxShadow: props.theme.boxShadow,
    color:props.theme.colors.secondary,
    fontWeight:500,
    cursor:'pointer',
    mx:'10px',
  })}
`;

const StyleImage = styled.img`
  width: 40px;
  height: 40px;
`;

const StylePrice = styled.div`
${css({
    fontSize:'12px',
    color:'detailsText'
  })}
`;

const StylePriceChange = styled.div<any>`
${({isPositive})=>css({
    fontSize:'10px',
    color:isPositive ? '#6ed14b' : '#ff2400',
  })}
`;

const renderTooltip = ({ payload }) => {
  const date = payload[0]?.payload?.date;
  return <StyledDate>{date}</StyledDate>;
};

const Symbol = ({ keyName, symbol,imageUrl , currentPrice ,change, isPositive}) => {
  const router = useRouter();
  return (
    <ChartIconCards
      onClick={() => {
        router.push(`/market/${keyName}`, undefined, { shallow: true });
      }}
      selected={router.query.symbol == keyName}
    >
      <div>
        {symbol.toUpperCase()}
      </div>
      <StyleImage src={imageUrl}/>
      <StylePrice>
        {currentPrice}
      </StylePrice>
      <StylePriceChange isPositive={isPositive}>
        {change}
      </StylePriceChange>
    </ChartIconCards>
  );
};

const Home: React.FC = ({ theme: currentTheme, changeTheme, pairData }: any) => {
  const theme: any = useTheme();
  const router = useRouter();
  const {assetPriceData} = useAssetPriceContext();
  const symbol = router.query.symbol as string;
  const [price, setPrice] = useState(parseFloat((pairData[symbol]).currentPrice));;
  const [useTV, setUseTV] = useState<boolean>(false);
  const [currentAsset, setCurrentAsset] = useState(pairData[symbol]);
  const [navigationData, setNavigationData] = useState(formatNavigationData(pairData))


  
  useEffect(() => {
    if(assetPriceData?.[symbol]) {
      setPrice(parseFloat(assetPriceData[symbol]?.currentPrice));
      setCurrentAsset(assetPriceData[symbol]);
    }
    if(assetPriceData) {
      setNavigationData(formatNavigationData(assetPriceData));
    }
    
  }, [assetPriceData]);

  useEffect(() => {
     if(assetPriceData) {
       setPrice(assetPriceData[symbol]?.currentPrice);
       setCurrentAsset(assetPriceData[symbol])
     }
     else {
      setPrice(pairData[symbol]?.currentPrice);
      setCurrentAsset(pairData[symbol])
     }
  }, [symbol]);

  const onMouseEnter = ({ isTooltipActive, activePayload }) => {
    if (isTooltipActive) setPrice(activePayload[0]?.payload.value);
  };

  const onMouseMove = ({ isTooltipActive, activePayload }) => {
    if (isTooltipActive) setPrice(activePayload[0]?.payload.value);
  };


  const onMouseLeave = () => {
    setPrice(currentAsset?.currentPrice);
  };


  const onSwitchTV = () => {
    if (!TV_SYMBOLS[symbol]) router.push('/market', undefined, { shallow: true });
    setUseTV((prev) => !prev);
  };

  return (
    <MainContainer>
      <NextSeo {...MarketSEO} />
      <Header theme={currentTheme} changeTheme={changeTheme} />
      <Container>
      <AssetDetails
          price={price}
          name={currentAsset.name}
          url={currentAsset.url}
          priceChange={{change: currentAsset.priceChange, percentChange: currentAsset.percentChange}}
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
               data={formatChartData(currentAsset?.historicalData, currentAsset?.tokenKey, symbol)}
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
        <ChartNavigationContainer useTV={useTV}>
          {Object.keys(navigationData).map((index) =>
            useTV ? (
              TV_SYMBOLS[navigationData[index].symbol] && 
              <Symbol key={index} keyName={navigationData[index].symbol} {...navigationData[index]}  />
            ) : (
              <Symbol key={index} keyName={navigationData[index].symbol} {...navigationData[index]}  />
            ),
          )}
        </ChartNavigationContainer>
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

  return {
    props: {
      pairData: await fetchPairData(),
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
