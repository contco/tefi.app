import { MirrorBorrowTitle } from '../../constants';
import { Heading, HeadingWrapper, Row, StyledText, Title, Wrapper, CSS_APR, SubText } from '../dashboardStyles';
import { Box } from '@contco/core-ui';
import { convertToFloatValue } from '../../utils/convertFloat';

const HEADING_TEXT = 'Mirror Borrow';

export interface ShortFarmProps {
  mirrorAssets: MirrorAccount;
}

const ShortFarms: React.FC<ShortFarmProps> = ({ mirrorAssets }) => {
  const getMirBorrow = () => {
    const short = mirrorAssets?.mirrorShortFarm;
    return short.map((assets: MirrorShortFarm, index) => (
      <Row key={index}>
        <StyledText fontWeight={500}> {assets?.assetInfo?.name}</StyledText>
        <StyledText>{assets?.assetInfo?.price} UST</StyledText>
        <Box>
          <StyledText>
            {convertToFloatValue(assets?.borrowInfo.amount.toString())} {assets?.assetInfo?.symbol}
          </StyledText>
          <SubText>{convertToFloatValue(assets?.borrowInfo?.amountValue.toString())} UST</SubText>
        </Box>
        <StyledText>{convertToFloatValue(assets?.collateralInfo?.collateral.toString())} UST</StyledText>
        <StyledText css={CSS_APR}>{assets?.collateralInfo?.collateralRatio.toFixed(2)}%</StyledText>
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
        {MirrorBorrowTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {getMirBorrow()}
    </Wrapper>
  );
};

export default ShortFarms;
