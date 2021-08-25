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
import { convertToFloatValue } from '../../utils/convertFloat';

const ICE_EMOJI = '❄️';
const FIRE_EMOJI = '🔥';

export interface SupplyProps {
  current: string;
  day: string;
  hour: string;
  month: string;
  symbol: string;
  week: string;
}

const AssetSupply: React.FC<{ assetSupply: [SupplyProps] }> = ({ assetSupply }) => {
  const valueConversion = (value) => convertToFloatValue((value / 1000000).toString());

  const timePeriodData = [
    {
      period: 'HOUR',
      value: valueConversion(assetSupply[0].hour),
    },
    {
      period: 'DAY',
      value: valueConversion(assetSupply[0].day),
    },
    {
      period: 'WEEK',
      value: valueConversion(assetSupply[0].week),
    },
    {
      period: 'MONTH',
      value: valueConversion(assetSupply[0].month),
    },
  ];
  const [currentTimePeriod, setCurrentTimePeriod] = useState(timePeriodData[0]);

  const changePeriod = (e) => {
    e.preventDefault();
    const newCurrentPeriod = timePeriodData.filter((period) => period.period === e.target.innerText)[0];
    setCurrentTimePeriod(newCurrentPeriod);
  };

  const getEmoji = () => {
    if (parseFloat(assetSupply[0].current) > currentTimePeriod.value) {
      return FIRE_EMOJI;
    } else return ICE_EMOJI;
  };
  return (
    <Container>
      <MainContainer>
        <Container>
          <TextContainer>
            <Supply>{currentTimePeriod.value}</Supply>
            <Symbol>{assetSupply[0].symbol === 'uluna' ? 'LUNAS' : 'UST'}</Symbol>
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
    </Container>
  );
};

export default AssetSupply;
