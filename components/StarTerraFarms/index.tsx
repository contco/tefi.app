import { StarTerraFarmTitle } from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Wrapper, Row, HeadingWrapper, Heading, StyledText, HoverText, SubText } from '../dashboardStyles';
import Header from '../../components/DashboardComponents/Header';
import { Box } from '@contco/core-ui';
import TitleContainer from '../DashboardComponents/TitleContainer';

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
        <StyledText isChildren={true}>
          {convertToFloatValue(data?.stakedLp)} LP
          <HoverText>
            {convertToFloatValue(data?.token2Staked)} {starterra?.symbol1} <br />
            {convertToFloatValue(data?.token1Staked)} {starterra?.symbol2}
          </HoverText>
        </StyledText>
        <StyledText> ${convertToFloatValue(data?.stakedLpUstValue)}</StyledText>
        <Box>
          <StyledText>
            {convertToFloatValue(data?.rewards)} {starterra.symbol1}
          </StyledText>
          <SubText>${convertToFloatValue(data?.rewardsValue)}</SubText>
        </Box>
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
