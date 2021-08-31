import { StarTerraFarmTitle } from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import {
  Wrapper,
  Row,
  HeadingWrapper,
  Heading,
  Title,
  StyledText,
  HoverText,
  SubText,
  StyledTextContainer,
  SimpleText,
} from '../dashboardStyles';
import { Box, Flex } from '@contco/core-ui';

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
        <Flex>
          <StyledTextContainer>
            <SimpleText>
              <b>Total Staked Value:</b> &nbsp;
            </SimpleText>
            <SimpleText>{convertToFloatValue(starterra?.totalStakedLpUstValue) + ' UST'}</SimpleText>
          </StyledTextContainer>
          <StyledTextContainer>
            <SimpleText>
              <b>Total Rewards Value:</b> &nbsp;
            </SimpleText>
            <SimpleText>{convertToFloatValue(starterra?.totalRewardsValue) + ' UST'}</SimpleText>
          </StyledTextContainer>
        </Flex>
      </HeadingWrapper>
      <Row>
        {StarTerraFarmTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {getFarms()}
    </Wrapper>
  );
};

export default StarTerraFarms;
