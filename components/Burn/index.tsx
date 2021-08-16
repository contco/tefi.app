import { convertToFloatValue } from '../../utils/convertFloat';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from '../dashboardStyles';
import { BurnTitle } from '../../constants';

const HEADING_TEXT = `Anchor Burn`;

export interface BurnProps {
  ancAssets: AccountAnc;
}

const Earn: React.FC<BurnProps> = ({ ancAssets }) => {
  const burn: BurnData = ancAssets?.burn;

  if (burn?.requestAmounts.length <= 0) return <></>;

  const getBurnData = () => {
    return burn?.requestAmounts.map((amount: string, index) => (
      <Row key={index}>
        <StyledText>{convertToFloatValue(amount)} bLUNA</StyledText>
      </Row>
    ));
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${0}</StyledText>
      </HeadingWrapper>
      <Row>
        {BurnTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {getBurnData()}
    </Wrapper>
  );
};

export default Earn;
