import React from 'react';
import Head from 'next/head';
import { GetStaticPaths } from 'next';
import { request } from 'graphql-request';
import Header from '../../components/Header';
import Bubble from '../../components/Bubble';
import data from '../../components/Bubble/images.json';
import { assets} from '../../constants/assets';
import { TERRA_SWAP_GRAPHQL_URL } from '../../constants';
import { getTokenKey } from '../../helpers/market';
import {GET_PAIRS_DATA} from '../../graphql/queries/getPairsData';
import { subYears} from 'date-fns';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Flex } from '@contco/core-ui';


const NEGATIVE_COLOR = '#d24a4a';
const POSTIVE_COLOR = '#95fa84';


const Container = styled(Flex)`
  ${css({
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 1,
    boxSizing: 'border-box',
    height: [400, 480, 520, 600, null, 860, '100vh'],
  })}
`;


const BubblesRow = styled(Flex)`
  ${css({
    margin:'auto',
    display:'flex',
    flexWrap:'wrap',
    flexDirection:'row',
    justifyContent: 'center',
  })}
`;

const HeatBubble: React.FC = ({ theme, changeTheme, pairData }: any) => {

    const priceChange = (singalPairData) =>{
        const dayCurrentPrice = singalPairData?.historicalData[0]?.[`${singalPairData.tokenKey}Price`];
        const dayOldPrice = singalPairData?.historicalData[1]?.[`${singalPairData.tokenKey}Price`];
        const change = parseFloat(dayCurrentPrice) - parseFloat(dayOldPrice);
        const percentChange = change / parseFloat(dayOldPrice)* 100;
        const roundOf = Math.abs(percentChange).toFixed(2);
        return roundOf;
    }

    const bubbleSize = (percentage) => {
        const defaultSize = 900;
        const size = (parseFloat(percentage)/defaultSize) * 100;
        return size;
    }

    const BubbleMap = () => {
       const result = data.map((a: any) => (
            <Bubble 
                key={a.symbol} 
                price={priceChange(pairData[a.symbol]) +'%'} 
                color={parseFloat(priceChange(pairData[a.symbol])) > 0? POSTIVE_COLOR : NEGATIVE_COLOR} 
                size={bubbleSize(priceChange(pairData[a.symbol]))}
                {...a} />
       ))
        return result
    }
    
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
                    {BubbleMap()}
                </BubblesRow>
                </Container>                
            </div>

        </div>
    );
};

export async function getStaticProps() {
  
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

export default HeatBubble;
