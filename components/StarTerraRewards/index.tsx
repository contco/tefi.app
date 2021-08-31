import { StarTerraRewardTitle } from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, SubText } from '../dashboardStyles';
import { Box } from '@contco/core-ui';

const HEADING_TEXT = `StarTerra Rewards`;

export interface PoolsProps {
  starterra: any;
}

const StarTerraRewards: React.FC<PoolsProps> = ({ starterra }) => {
  const getRewards = () => {
    return starterra.stakedData.map((data: StarStakedData, index) => (
      <Row key={index}>
        <StyledText fontWeight={500}> {data?.lpname}</StyledText>
        <StyledText> {data?.faction}</StyledText>
        <StyledText>{convertToFloatValue('0')}%</StyledText>
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
        <StyledText>${0}</StyledText>
      </HeadingWrapper>
      <Row>
        {StarTerraRewardTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {getRewards()}
    </Wrapper>
  );
};

export default StarTerraRewards;
