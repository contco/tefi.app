import { ShortTitle } from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Heading, HeadingWrapper, Row, StyledText, SubText, Title, Wrapper } from '../dashboardStyles';
import { Box } from '@contco/core-ui';

const HEADING_TEXT = 'Mirror Short Farms';

export interface ShortFarmProps {
  mirrorAssets: MirrorAccount;
}

const ShortFarms: React.FC<ShortFarmProps> = ({ mirrorAssets }) => {
  const getShorts = () => {
    const short = mirrorAssets?.mirrorShortFarm;
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

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>$total</StyledText>
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
