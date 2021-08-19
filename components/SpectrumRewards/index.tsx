
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, SubText, CSS_APR } from '../dashboardStyles';
import { times } from '../../pages/api/mirror/utils';
import { convertToFloatValue } from '../../utils/convertFloat';

const HEADING_TEXT = `Spectrum Rewards`;

export interface RewardsProps {
  spectrum: SpectrumAccount
}

const Rewards: React.FC<RewardsProps> = ({ spectrum }) => {

  const getRewardsTotal = () => {
    return convertToFloatValue(spectrum?.spectrumTotal?.rewardsTotal) ??  0;
  };

  const formatApr = (apr = '0') => {
    const aprPercentage = times(apr, 100);
    return parseFloat(aprPercentage).toFixed(2);
  };

  const getFarmsRewards = () => {
    return spectrum.farms.map((farm: SpecFarms, index) => (
      <Row key={index}>
        <StyledText fontWeight={500}> {farm?.lpName}</StyledText>
       <StyledText css={CSS_APR}> {formatApr(farm?.apy)}%</StyledText>
        <div>
            <StyledText> {convertToFloatValue(farm?.stakedSpec)} SPEC</StyledText>
            <SubText> ${convertToFloatValue(farm?.stakedSpecValue)}</SubText>
        </div>

        <div>
            {farm?.farm !== "Spectrum" ? 
            (
            <div>
                <StyledText> {convertToFloatValue(farm?.tokenRewardsStaked)} {farm?.tokenRewardsStakedSymbol}</StyledText>
                <SubText> ${convertToFloatValue(farm?.tokenRewardsStakedValue)}</SubText>
            </div>
            )
            : 
            <StyledText> N/A</StyledText>
            }
        </div>
        
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
        <StyledText>${getRewardsTotal()}</StyledText>
      </HeadingWrapper>
      <Row>
          <Title>Name</Title>
          <Title>APY</Title>
          <Title>SPEC Rewards</Title>
          <Title>Token Rewards</Title>
      </Row>
      {getFarmsRewards()}
    </Wrapper>
  );
};

export default Rewards;
