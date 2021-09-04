import { ShortTitle } from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Heading, HeadingWrapper, Row, StyledText, SubText, Wrapper } from '../dashboardStyles';
import Header from '../../components/DashboardComponents/Header';
import { Box } from '@contco/core-ui';
import TitleContainer from '../DashboardComponents/TitleContainer';
import AssetContainer from '../DashboardComponents/AssetContainer';

const HEADING_TEXT = 'Mirror Short Farms';

export interface ShortFarmProps {
  mirrorAssets: MirrorAccount;
}
export const getTotalForFarm = (short, prop) => {
  const total = short.reduce((a, shortAsset) => a + parseFloat(shortAsset?.lockedInfo[prop]), 0);
  return total.toString();
};

const ShortFarms: React.FC<ShortFarmProps> = ({ mirrorAssets }) => {
  let short = mirrorAssets?.mirrorShortFarm?.filter(
    (assets) =>
      parseFloat(assets?.lockedInfo?.locked_amount) > 0 || parseFloat(assets?.lockedInfo?.unlocked_amount) > 0,
  );

  const getShorts = () => {
    short = short
      .slice()
      .sort((a, b) => parseFloat(b?.lockedInfo?.rewardValue) - parseFloat(a?.lockedInfo?.rewardValue));
    return short.map((assets: MirrorShortFarm, index) => (
      <Row key={index}>
        <StyledText fontWeight={500}> {assets?.assetInfo?.symbol}</StyledText>
        <StyledText>
          {convertToFloatValue(assets?.lockedInfo?.shorted)} {assets?.assetInfo?.symbol}
        </StyledText>
        <Box>
          <StyledText>{convertToFloatValue(assets?.lockedInfo?.locked_amount)} UST</StyledText>
          <SubText>{assets?.lockedInfo?.unlock_time}</SubText>
        </Box>
        <StyledText>{convertToFloatValue(assets?.lockedInfo?.unlocked_amount)} UST</StyledText>
        <AssetContainer
          token={convertToFloatValue(assets?.lockedInfo?.reward) + ' MIR'}
          tokenValue={convertToFloatValue(assets?.lockedInfo?.rewardValue) + ' UST'}
        />
      </Row>
    ));
  };

  if (!short || short.length === 0) {
    return <></>;
  }

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Header
          data={[
            { name: 'Reward', value: convertToFloatValue(getTotalForFarm(short, 'reward')) + ' MIR' },
            { name: 'Locked', value: convertToFloatValue(getTotalForFarm(short, 'locked_amount')) + ' UST' },
            { name: 'Unlocked', value: convertToFloatValue(getTotalForFarm(short, 'unlocked_amount')) + ' UST' },
          ]}
        />
      </HeadingWrapper>
      <TitleContainer titles={ShortTitle} />
      {getShorts()}
    </Wrapper>
  );
};

export default ShortFarms;
