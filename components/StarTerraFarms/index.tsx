import { StarTerraFarmTitle } from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText } from '../dashboardStyles';

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
          {convertToFloatValue(data?.stakedLP)} LP
          <HoverText>
            {convertToFloatValue(data?.token2Staked)} {starterra?.symbol1} <br />
            {convertToFloatValue(data?.token1Staked)} {starterra?.symbol2}
          </HoverText>
        </StyledText>
        <StyledText> ${convertToFloatValue(data?.stakedLPUstValue)}</StyledText>
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
        {StarTerraFarmTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {getFarms()}
    </Wrapper>
  );
};

export default StarTerraFarms;
