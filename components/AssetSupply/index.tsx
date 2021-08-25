import { useState } from 'react';
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

const ICE_EMOJI = '❄️';
const FIRE_EMOJI = '🔥';

const AssetSupply: React.FC = ({ assetSupply }: any) => {
  const timePeriodData = [
    {
      period: 'HOUR',
      value: assetSupply[0].hour,
    },
    {
      period: 'DAY',
      value: assetSupply[0].day,
    },
    {
      period: 'WEEK',
      value: assetSupply[0].week,
    },
    {
      period: 'MONTH',
      value: assetSupply[0].month,
    },
  ];
  const [currentTimePeriod, setCurrentTimePeriod] = useState(timePeriodData[0]);

  const changePeriod = (e) => {
    e.preventDefault();
    const newCurrentPeriod = timePeriodData.filter((period) => period.period === e.target.innerText)[0];
    setCurrentTimePeriod(newCurrentPeriod);
  };

  const getEmoji = () => {
    if (parseFloat(assetSupply.current) > parseFloat(currentTimePeriod.value)) {
      return FIRE_EMOJI;
    } else return ICE_EMOJI;
  };
  return (
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
  );
};

export default AssetSupply;
