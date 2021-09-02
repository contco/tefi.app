import { Wrapper, Row, HeadingWrapper, Heading, StyledText, SubText} from './dashboardStyles';
import { convertToFloatValue } from '../utils/convertFloat';
import {useState, useEffect } from 'react';
import TitleContainer from './DashboardComponents/TitleContainer';
const HEADING_TEXT = `Pylon Gateway`;

const PylonTitles = ['Pool Name', 'Deposit', 'Rewards'];
interface Props {
  pylonAssets: PylonAccount
}

const PylonGateway: React.FC<Props> = ({ pylonAssets }: Props) => {

  const [gatewayData, setGatewayData] = useState<PylonGateway[]>([]);

  const getGatewayTotal = () => {
    const total = parseFloat(pylonAssets?.pylonSum?.gatewayDepositsSum) + parseFloat(pylonAssets?.pylonSum?.gatewayRewardsSum);
    return convertToFloatValue(total.toString()) ?? '0';
  };


  useEffect(() => {
    if(pylonAssets.pylonGateway || pylonAssets?.pylonGateway.length !== 0) {
      const filterdData= pylonAssets.pylonGateway.slice().sort((a,b) => parseFloat(b.rewardsValue) - parseFloat(a.rewardsValue));
      setGatewayData(filterdData);
    }
  }, [pylonAssets?.pylonGateway])

 if(!gatewayData || gatewayData.length === 0) {
   return <> </>;
 };


  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${getGatewayTotal()}</StyledText>
      </HeadingWrapper>
      <TitleContainer titles={PylonTitles}/>
      {gatewayData.map((asset: PylonGateway) => (
        <Row key={asset.poolName}>
          <StyledText fontWeight={500}> {asset.poolName}</StyledText>
          <StyledText> ${convertToFloatValue(asset.totalDeposit)}</StyledText>
          <div>
          <StyledText> {convertToFloatValue(asset.rewards)} {asset.symbol}</StyledText>
          <SubText>${convertToFloatValue(asset?.rewardsValue)}</SubText>
          </div>
        </Row>
      ))}
    </Wrapper>
  );
};

export default PylonGateway;
