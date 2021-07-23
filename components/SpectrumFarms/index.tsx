import { convertToFloatValue } from '../../utils/convertFloat';
import { Wrapper, Row,HeadingWrapper, Heading, Title, StyledText,HoverText } from '../dashboardStyles';

const HEADING_TEXT = `Spectrum Farms`;

export interface PoolsProps {
    spectrum: SpectrumAccount
}

const Pools: React.FC<PoolsProps> = ({ spectrum }) => {
  const getFarmsTotal = () => {
    return convertToFloatValue(spectrum?.spectrumTotal?.farmsTotal);
  };

  const getFarms = () => {
    return spectrum.farms.map((farm: SpecFarms, index) => (
      <Row key={index}>
        <StyledText fontWeight={500}> {farm?.lpName}</StyledText>
        <StyledText> {farm?.farm}</StyledText>
        <StyledText isChildren={true}>
          {convertToFloatValue(farm?.stakedLp)} LP
          <HoverText>
            {convertToFloatValue(farm?.tokenStaked)} {farm?.symbol} <br />
            {convertToFloatValue(farm?.ustStaked)} {'UST'}
          </HoverText>
        </StyledText>
        <StyledText> ${convertToFloatValue(farm?.stakedLpUstValue)}</StyledText>
      </Row>
    ));
  };

  if (!spectrum?.farms || spectrum?.farms.length === 0 ) {
    return <> </>;
  } 


  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${getFarmsTotal()}</StyledText>
      </HeadingWrapper>
      <Row>
          <Title>Name</Title>
          <Title>Farm</Title>
          <Title>Balance</Title>
          <Title>Value</Title>
      </Row>
      {getFarms()}
    </Wrapper>
  );
};

export default Pools;
