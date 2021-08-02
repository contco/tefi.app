import { ShortTitle } from '../../constants';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Heading, HeadingWrapper, Row, StyledText, Title, Wrapper } from '../dashboardStyles';

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
        <StyledText>Shorted</StyledText>
        <StyledText>{convertToFloatValue(assets?.lockedInfo?.lockedAmount)} UST</StyledText>
        <StyledText>unlocked amount</StyledText>
        <StyledText>Reward</StyledText>
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
