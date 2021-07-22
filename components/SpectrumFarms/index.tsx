import { convertToFloatValue } from '../../utils/convertFloat';
import { Wrapper, Row,ColumnFlex, HeadingWrapper, Heading, Title, StyledText, SubText ,HoverText, CSS_APR } from '../dashboardStyles';

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
        <StyledText isChildren={true}>
          {convertToFloatValue(farm?.stakedLp)} LP
          <HoverText>
            {convertToFloatValue(farm?.tokenStaked)} {farm?.symbol} <br />
            {convertToFloatValue(farm?.ustStaked)} {'UST'}
          </HoverText>
        </StyledText>
        <StyledText> ${convertToFloatValue(farm?.stakedLpUstValue)}</StyledText>
        <StyledText css={CSS_APR}> {(parseFloat(farm?.apy) * 100).toFixed(3)}%</StyledText>
        <ColumnFlex>
            <StyledText> {convertToFloatValue(farm?.stakedSpec)} SPEC</StyledText>
            <SubText> ${convertToFloatValue(farm?.stakedSpecValue)}</SubText>
            {farm.farm === "Mirror" ? (
            <>
            <StyledText mt={3}> {convertToFloatValue(farm?.stakedMir)} {"MIR"}</StyledText>
            <SubText> ${convertToFloatValue(farm?.stakedMirValue)}</SubText>
            </>
            ) : null}
        </ColumnFlex>
      </Row>
    ));
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${getFarmsTotal()}</StyledText>
      </HeadingWrapper>
      <Row>
          <Title>Name</Title>
          <Title>Balance</Title>
          <Title>Value</Title>
          <Title>APY</Title>
          <Title>Rewards Staked</Title>
      </Row>
      {getFarms()}
    </Wrapper>
  );
};

export default Pools;
