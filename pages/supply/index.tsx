import { useState } from 'react';
import Header from '../../components/Header';
import Head from 'next/head';
import { Text } from '@contco/core-ui';
import {
  MainContainer,
  Container,
  Supply,
  Symbol,
  TextContainer,
  FireBox,
  Flame,
  FlameBase,
  TimePeriods,
  Time,
} from './styles';

const assetSupply = {
  symbol: 'LUNAS',
  current: '2100',
  hour: '2300',
  day: '1800',
  week: '2500',
  month: '2000',
};

const timePeriodData = [
  {
    period: 'HOUR',
    value: assetSupply.hour,
  },
  {
    period: 'DAY',
    value: assetSupply.day,
  },
  {
    period: 'WEEK',
    value: assetSupply.week,
  },
  {
    period: 'MONTH',
    value: assetSupply.month,
  },
];

const ICE_EMOJI = '❄️';
const FIRE_EMOJI = '🔥';

const AssetSupply: React.FC = ({ theme, changeTheme }: any) => {
  const [currentTimePeriod, setCurrentTimePeriod] = useState(timePeriodData[0]);

  const changePeriod = (e) => {
    e.preventDefault();
    const newCurrentPeriod = timePeriodData.filter((period) => period.period === e.target.innerText)[0];
    setCurrentTimePeriod(newCurrentPeriod);
  };

  const getEmoji = () => {
    if (parseFloat(assetSupply.current) < parseFloat(currentTimePeriod.value)) {
      return FIRE_EMOJI;
    } else return ICE_EMOJI;
  };

  return (
    <>
      <Head>
        <title>Tefi App - Asset Supply</title>
      </Head>
      <Header theme={theme} changeTheme={changeTheme} />
      <MainContainer>
        <Container>
          <TextContainer>
            <Supply>{currentTimePeriod.value}</Supply>
            <Symbol>{assetSupply.symbol}</Symbol>
          </TextContainer>
          <FireBox>
            <Text>
              <FlameBase>{getEmoji()}</FlameBase>
              <Flame>{getEmoji()}</Flame>
              <Flame>{getEmoji()}</Flame>
              <Flame>{getEmoji()}</Flame>
            </Text>
          </FireBox>
          <TimePeriods>
            {timePeriodData.map((time, index) => (
              <Time key={index} selected={time.period === currentTimePeriod.period} onClick={changePeriod}>
                {time.period}
              </Time>
            ))}
          </TimePeriods>
        </Container>
      </MainContainer>
    </>
  );
};

export default AssetSupply;
