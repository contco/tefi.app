import { Wrapper, Row, HeadingWrapper, Heading, StyledText, CSS_APR } from '../dashboardStyles';
import { times } from '../../pages/api/mirror/utils';
import { convertToFloatValue } from '../../utils/convertFloat';
import TitleContainer from '../DashboardComponents/TitleContainer';
import AssetContainer from '../DashboardComponents/AssetContainer';

const HEADING_TEXT = `Spectrum Rewards`;

const SpecRewardTitles = ['Name', 'APY', 'SPEC Rewards', 'Total Rewards'];

export interface RewardsProps {
  spectrum: SpectrumAccount;
}

const Rewards: React.FC<RewardsProps> = ({ spectrum }) => {
  const getRewardsTotal = () => {
    return convertToFloatValue(spectrum?.spectrumTotal?.rewardsTotal) ?? 0;
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
        <AssetContainer
          token={convertToFloatValue(farm?.stakedSpec) + ' SPEC'}
          tokenValue={'$' + convertToFloatValue(farm?.stakedSpecValue)}
        />
        <div>
          {farm?.farm !== 'Spectrum' ? (
            <AssetContainer
              token={convertToFloatValue(farm?.tokenRewardsStaked) + ' ' + farm?.tokenRewardsStakedSymbol}
              tokenValue={'$' + convertToFloatValue(farm?.tokenRewardsStakedValue)}
            />
          ) : (
            <StyledText> N/A</StyledText>
          )}
        </div>
      </Row>
    ));
  };

  if (!spectrum?.farms || spectrum?.farms.length === 0) {
    return <> </>;
  }

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${getRewardsTotal()}</StyledText>
      </HeadingWrapper>
      <TitleContainer titles={SpecRewardTitles} />
      {getFarmsRewards()}
    </Wrapper>
  );
};

export default Rewards;
