import { StarTerraFarmTitle } from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Wrapper, Row, HeadingWrapper, Heading, StyledText } from '../dashboardStyles';
import Header from '../../components/DashboardComponents/Header';
import TitleContainer from '../DashboardComponents/TitleContainer';
import AssetContainer from '../DashboardComponents/AssetContainer';
import LpContainer from '../DashboardComponents/LpContainer';

const HEADING_TEXT = `StarTerra Farms`;

export interface StarProps {
  starterra: StarTerraAccount;
}

const StarTerraFarms: React.FC<StarProps> = ({ starterra }) => {
  const getFarms = () => {
    return starterra.stakedData.map((data: StarStakedData, index) => (
      <Row key={index}>
        <StyledText fontWeight={500}> {data?.lpname}</StyledText>
        <StyledText> {data?.faction}</StyledText>
        <LpContainer
          lp={convertToFloatValue(data?.stakedLp) + ' LP'}
          token1={convertToFloatValue(data?.token2Staked) + ' ' + starterra?.symbol1}
          token2={convertToFloatValue(data?.token1Staked) + ' ' + starterra?.symbol2}
        />
        <StyledText> ${convertToFloatValue(data?.stakedLpUstValue)}</StyledText>
        <AssetContainer
          token={convertToFloatValue(data?.rewards) + ' ' + starterra.symbol1}
          tokenValue={'$' + convertToFloatValue(data?.rewardsValue)}
        />
      </Row>
    ));
  };

  if (!starterra?.stakedData || starterra?.stakedData.length === 0) {
    return <> </>;
  }

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header
          data={[
            { name: 'Total Staked Value', value: convertToFloatValue(starterra?.totalStakedLpUstValue) + ' UST' },
            { name: 'Total Reward Value', value: convertToFloatValue(starterra?.totalRewardsValue) + ' UST' },
          ]}
        />
      </HeadingWrapper>
      <TitleContainer titles={StarTerraFarmTitle} />
      {getFarms()}
    </Wrapper>
  );
};

export default StarTerraFarms;
