import { Wrapper, Row, HeadingWrapper, Heading, Title, SubText, StyledText } from '../dashboardStyles';
import { convertToFloatValue } from '../../utils/convertFloat';

const TITLES_LIST = ['Validator', 'Balance', 'Rewards', 'Value'];
const HEADING_TEXT = `Luna Staking`;

export interface AssetsProps {
  core: Core
}

const Assets: React.FC<AssetsProps> = ({core}: AssetsProps) => {
  const getStakedTotal = () => {
    const total =  core?.total?.stakedSum;
    return total ?? '0';
  };

 if(!core?.staking || core.staking.length === 0) {
   return <> </>;
 }
 
  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${parseInt(getStakedTotal()).toFixed(3)}</StyledText>
      </HeadingWrapper>
      <Row>
          {TITLES_LIST.map((item) => (
            <Title key={item}>{item}</Title>
          ))}
      </Row>
      {core?.staking.map((asset: LunaStaking) => (
        <Row key={asset?.validator}>
          <StyledText fontWeight={500}> {asset.validator}</StyledText>
          <div>
            <StyledText>{convertToFloatValue(asset.balance)} Luna</StyledText>
            <SubText>${convertToFloatValue(asset.stakedValue)}</SubText>
          </div>
          <div>
            <StyledText> {convertToFloatValue(asset.rewards)} Luna</StyledText>
            <SubText>${convertToFloatValue(asset.rewardsValue)}</SubText>
          </div>
          <StyledText> ${convertToFloatValue(asset.totalValue)}</StyledText>
        </Row>
      ))}
    </Wrapper>
  );
};

export default Assets;
