import { ShortTitle } from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Heading, HeadingWrapper, Row, StyledText, SubText, Title, Wrapper } from '../dashboardStyles';
import { Box, Flex } from '@contco/core-ui';

const HEADING_TEXT = 'Mirror Short Farms';

export interface ShortFarmProps {
  mirrorAssets: MirrorAccount;
}
export const getTotalForFarm = (short, prop) => {
  const total = short.reduce((a, shortAsset) => a + parseFloat(shortAsset?.lockedInfo[prop]), 0);
  return total.toString();
};

const ShortFarms: React.FC<ShortFarmProps> = ({ mirrorAssets }) => {
  let short = mirrorAssets?.mirrorShortFarm;

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
        <Box>
          <StyledText>{convertToFloatValue(assets?.lockedInfo?.reward)} MIR</StyledText>
          <SubText>{convertToFloatValue(assets?.lockedInfo?.rewardValue)} UST</SubText>
        </Box>
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
        <Flex>
          <StyledText display="flex">
            <b>Reward: </b>
            &nbsp;
            {convertToFloatValue(getTotalForFarm(short, 'reward'))} MIR
          </StyledText>
          <StyledText display="flex">
            <b>Locked: </b>
            &nbsp;
            {convertToFloatValue(getTotalForFarm(short, 'locked_amount'))} UST
          </StyledText>
          <StyledText display="flex">
            <b>Unlocked: </b>
            &nbsp;
            {convertToFloatValue(getTotalForFarm(short, 'unlocked_amount'))} UST
          </StyledText>
        </Flex>
      </HeadingWrapper>
      <Row>
        {ShortTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {getShorts()}
    </Wrapper>
  );
};

export default ShortFarms;
