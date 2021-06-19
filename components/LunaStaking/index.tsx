import { Wrapper, Row, HeadingWrapper, Heading, Title, SubText, StyledText } from '../dashboardStyles';


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
            <StyledText>{parseFloat(asset.balance).toFixed(3)} Luna</StyledText>
            <SubText>${parseFloat(asset.stakedValue).toFixed(3)}</SubText>
          </div>
          <div>
            <StyledText> {parseFloat(asset.rewards).toFixed(3)} Luna</StyledText>
            <SubText>${parseFloat(asset.rewardsValue).toFixed(3)}</SubText>
          </div>
          <StyledText> ${parseFloat(asset.totalValue).toFixed(3)}</StyledText>
        </Row>
      ))}
    </Wrapper>
  );
};

export default Assets;
