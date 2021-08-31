import { StarTerraFarmTitle} from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText } from '../dashboardStyles';

const HEADING_TEXT = `StarTerra Farms`;

export interface PoolsProps {
  starterra: any;
}

const StarTerraFarms: React.FC<PoolsProps> = ({ starterra }) => {
  // const getFarmsTotal = () => {
  //   return convertToFloatValue(spectrum?.spectrumTotal?.farmsTotal);
  // };

  // const getFarms = () => {
  //   return spectrum.farms.map((farm: SpecFarms, index) => (
  //     <Row key={index}>
  //       <StyledText fontWeight={500}> {farm?.lpName}</StyledText>
  //       <StyledText> {farm?.farm}</StyledText>
  //       <StyledText isChildren={true}>
  //         {convertToFloatValue(farm?.stakedLp)} LP
  //         <HoverText>
  //           {convertToFloatValue(farm?.tokenStaked)} {farm?.symbol} <br />
  //           {convertToFloatValue(farm?.ustStaked)} {'UST'}
  //         </HoverText>
  //       </StyledText>
  //       <StyledText> ${convertToFloatValue(farm?.stakedLpUstValue)}</StyledText>
  //     </Row>
  //   ));
  // };

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
      {/* {getFarms()} */}
    </Wrapper>
  );
};

export default StarTerraFarms;
