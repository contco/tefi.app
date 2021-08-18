import { convertToFloatValue } from '../../utils/convertFloat';
import {
  Wrapper,
  Row,
  HeadingWrapper,
  Heading,
  Title,
  StyledText,
  SubText,
  StyledTextContainer,
  SimpleText,
} from '../dashboardStyles';
import { BurnTitle } from '../../constants';
import { Box, Flex } from '@contco/core-ui';

const HEADING_TEXT = `Anchor Bond`;

export interface BurnProps {
  ancAssets: AccountAnc;
}

const Earn: React.FC<BurnProps> = ({ ancAssets }) => {
  const burn: BurnData = ancAssets?.burn;

  const withdrawableAmount = burn.withdrawableAmount;

  if (burn?.requestData.length <= 0) return <></>;

  const getBurnData = () => {
    return burn?.requestData.map((data: RequestData, index) => (
      <Row key={index}>
        <Box>
          <StyledText>{convertToFloatValue(data.amount.amount)} bLUNA</StyledText>
          <SubText>${convertToFloatValue(data.amount.amountValue)}</SubText>
        </Box>
        <StyledText>{data.time.requestedTime || 'Pending'}</StyledText>
        <StyledText>{data.time.claimableTime || 'Pending'}</StyledText>
      </Row>
    ));
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Flex>
          <StyledTextContainer>
            <SimpleText>
              <b>Total:</b> &nbsp;
            </SimpleText>
            <SimpleText>${convertToFloatValue(burn?.totalBurnAmountValue)}</SimpleText>
          </StyledTextContainer>
          <StyledTextContainer>
            <SimpleText>
              <b>Withdrawable Amount:</b> &nbsp;
            </SimpleText>
            <SimpleText>{withdrawableAmount} bLUNA</SimpleText>
          </StyledTextContainer>
        </Flex>
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
