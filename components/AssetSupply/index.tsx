import { useState, useMemo } from 'react';
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
import { format } from 'path';

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

  const timePeriodData = [
    {
      period: 'HOUR',
      value: parseFloat(assetSupply[0].hour),
    },
    {
      period: 'DAY',
      value: parseFloat(assetSupply[0].day),
    },
    {
      period: 'WEEK',
      value: parseFloat(assetSupply[0].week),
    },
    {
      period: 'MONTH',
      value: parseFloat(assetSupply[0].month),
    },
  ];

  const [currentTimePeriod, setCurrentTimePeriod] = useState(timePeriodData[0]);
  const currentAssetSupply = useMemo(() => assetSupply[0]?.current ? parseFloat(assetSupply[0].current) : 0, [assetSupply[0]?.current]);

  const changePeriod = (e) => {
    e.preventDefault();
    const newCurrentPeriod = timePeriodData.filter((period) => period.period === e.target.innerText)[0];
    setCurrentTimePeriod(newCurrentPeriod);
  };

  const getEmoji = () => {
    if (currentAssetSupply > currentTimePeriod.value) {
      return ICE_EMOJI;
    } else return FIRE_EMOJI;
  };

  const getSupply = () => {
    const assetChange = Math.round(currentAssetSupply - currentTimePeriod.value);
    const formatSupply = new Intl.NumberFormat().format(assetChange);
    return formatSupply;
  } 

  return (
    <Container>
      <MainContainer>
        <Container>
          <TextContainer>
            <Supply>{getSupply()}</Supply>
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
