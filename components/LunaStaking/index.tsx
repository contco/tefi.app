import { Wrapper, Row, HeadingWrapper, Heading, Title, SubText, StyledText, SimpleText, StyledTextContainer } from '../dashboardStyles';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Flex } from '@contco/core-ui';

const TITLES_LIST = ['Validator', 'Balance', 'Rewards', 'Value', 'State'];
const HEADING_TEXT = `Luna Staking`;

export interface AssetsProps {
  core: Core;
}

const Assets: React.FC<AssetsProps> = ({ core }: AssetsProps) => {
  const getStakedTotal = () => {
    const total = core?.total?.stakedSum;
    return convertToFloatValue(total.toString()) ?? '0';
  };
  
  const getUnStakedTotal = ()=> {
     const total = core?.total?.unstakedSum;
    return convertToFloatValue(total.toString()) ?? '0';
  }

  if (!core?.staking || core.staking.length === 0) {
    return <> </>;
  }

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
         <Flex>
          <StyledTextContainer>
            <SimpleText>
            <b>Staked Total:</b> &nbsp;
            </SimpleText>
          <SimpleText>
          ${getStakedTotal()}
          </SimpleText>
          </StyledTextContainer>
          <StyledTextContainer>
          <SimpleText>
            <b>Unstaked Total:</b> &nbsp;
            </SimpleText>
          <SimpleText>
            ${getUnStakedTotal()}
          </SimpleText>
          </StyledTextContainer>
        </Flex>
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
          {asset.state === 'Delegated' ? (
            <div>
              <StyledText> {convertToFloatValue(asset.rewards)} Luna</StyledText>
              <SubText>${convertToFloatValue(asset.rewardsValue)}</SubText>
            </div>
          ) : (
            <StyledText>-</StyledText>
          )}
          <StyledText> ${convertToFloatValue(asset.totalValue)}</StyledText>
          <StyledText>{asset.state}</StyledText>
        </Row>
      ))}
    </Wrapper>
  );
};

export default Assets;
