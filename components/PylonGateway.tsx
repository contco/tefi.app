import {format} from "date-fns";
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, SubText} from './dashboardStyles';
import { convertToFloatValue } from '../utils/convertFloat';
const HEADING_TEXT = `Pylon Gateway`;

interface Props {
  pylonAssets: PylonAccount
}

const PylonGateway: React.FC<Props> = ({ pylonAssets }: Props) => {

  const getGatewayTotal = () => {
    const total = parseFloat(pylonAssets?.pylonSum?.gatewayDepositsSum) + parseFloat(pylonAssets?.pylonSum?.gatewayRewardsSum);
    return total.toFixed(3) ?? '0';
  };

 if(!pylonAssets.pylonGateway || pylonAssets?.pylonGateway.length === 0) {
   return <> </>;
 };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${getGatewayTotal()}</StyledText>
      </HeadingWrapper>
      <Row>
          <Title> Pool Name</Title>
          <Title> Deposit</Title>
          <Title> Lockup Ending</Title>
          <Title> Rewards Claim</Title>
          <Title> Rewards</Title>
      </Row>
      {pylonAssets?.pylonGateway.map((asset: PylonGateway) => (
        <Row key={asset.poolName}>
          <StyledText fontWeight={500}> {asset.poolName}</StyledText>
          <StyledText> ${asset.deposit}</StyledText>
          <StyledText> {format(new Date(asset.depositReleaseDate), "dd-LLL-yy")}</StyledText>
          <StyledText>{format(new Date(asset.rewardReleaseDate), "dd-LLL-yy")}</StyledText>
          <div>
          <StyledText> {convertToFloatValue(asset.reward)} {asset.symbol}</StyledText>
          <SubText>${convertToFloatValue(asset?.rewardValue)}</SubText>
          </div>
        </Row>
      ))}
    </Wrapper>
  );
};

export default PylonGateway;
