import { convertToFloatValue } from '../../utils/convertFloat';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, SubText } from '../dashboardStyles';
import Header from '../../components/DashboardComponents/Header';
import { BurnTitle } from '../../constants';
import { Box } from '@contco/core-ui';

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
        <Header
          data={[
            { name: 'Total', value: '$' + convertToFloatValue(burn?.totalBurnAmountValue) },
            {
              name: 'Withdrawable Amount',
              value: withdrawableAmount + ' LUNA',
            },
          ]}
        />
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
