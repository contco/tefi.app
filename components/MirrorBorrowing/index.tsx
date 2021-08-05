import { MirrorBorrowTitle } from '../../constants';
import { Heading, HeadingWrapper, Row, StyledText, Title, Wrapper, CSS_APR, SubText } from '../dashboardStyles';
import { Box, Flex } from '@contco/core-ui';
import { convertToFloatValue } from '../../utils/convertFloat';

const HEADING_TEXT = 'Mirror Borrow';

export interface ShortFarmProps {
  mirrorAssets: MirrorAccount;
}

const ShortFarms: React.FC<ShortFarmProps> = ({ mirrorAssets }) => {
  let short = mirrorAssets?.mirrorShortFarm;

  const getBorrowedTotal = () => {
    const short = mirrorAssets?.mirrorShortFarm;
    const totalBorrowed = short.reduce((a, shortAsset) => a + parseFloat(shortAsset?.borrowInfo?.amountValue), 0);
    return totalBorrowed.toString();
  };

  const getCollateralTotal = () => {
    const short = mirrorAssets?.mirrorShortFarm;
    const totalCollateral = short.reduce(
      (a, shortAsset) => a + parseFloat(shortAsset?.collateralInfo?.collateralValue),
      0,
    );
    return totalCollateral.toString();
  };

  const getMirBorrow = () => {
    short = short
      .slice()
      .sort((a, b) => parseFloat(b?.collateralInfo?.collateralRatio) - parseFloat(a?.collateralInfo?.collateralRatio));
    return short.map((assets: MirrorShortFarm, index) => (
      <Row key={index}>
        <StyledText fontWeight={500}> {assets?.assetInfo?.name}</StyledText>
        <StyledText>{convertToFloatValue(assets?.assetInfo?.price)} UST</StyledText>
        <Box>
          <StyledText>
            {convertToFloatValue(assets?.borrowInfo.amount)} {assets?.assetInfo?.symbol}
          </StyledText>
          <SubText>{convertToFloatValue(assets?.borrowInfo?.amountValue)} UST</SubText>
        </Box>
        <Box>
          <StyledText>
            {convertToFloatValue(assets?.collateralInfo?.collateral)} {assets?.collateralInfo?.csymbol}
          </StyledText>
          <SubText>
            {assets?.collateralInfo?.csymbol === 'UST'
              ? null
              : convertToFloatValue(assets?.collateralInfo?.collateralValue) + ' UST'}
          </SubText>
        </Box>
        <StyledText css={CSS_APR}>{parseFloat(assets?.collateralInfo?.collateralRatio).toFixed(2)}%</StyledText>
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
            <b>Borrowed: </b>
            &nbsp;
            {convertToFloatValue(getBorrowedTotal())} UST
          </StyledText>
          <StyledText display="flex">
            <b>Collateral: </b>
            &nbsp;
            {convertToFloatValue(getCollateralTotal())} UST
          </StyledText>
        </Flex>
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
