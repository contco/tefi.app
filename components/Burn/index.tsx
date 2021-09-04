import { convertToFloatValue } from '../../utils/convertFloat';
import { Wrapper, Row, HeadingWrapper, Heading, StyledText } from '../dashboardStyles';
import Header from '../../components/DashboardComponents/Header';
import { BurnTitle } from '../../constants';
import TitleContainer from '../DashboardComponents/TitleContainer';
import AssetContainer from '../DashboardComponents/AssetContainer';

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
        <AssetContainer
          token={convertToFloatValue(data.amount.amount) + ' bLUNA'}
          tokenValue={'$' + convertToFloatValue(data.amount.amountValue)}
        />
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
      <TitleContainer titles={BurnTitle} />
      {getBurnData()}
    </Wrapper>
  );
};

export default Earn;
