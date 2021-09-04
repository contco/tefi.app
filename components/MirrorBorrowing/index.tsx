import { MirrorBorrowTitle } from '../../constants';
import { Heading, HeadingWrapper, Row, StyledText, Wrapper, CSS_APR } from '../dashboardStyles';
import Header from '../../components/DashboardComponents/Header';
import { convertToFloatValue } from '../../utils/convertFloat';
import TitleContainer from '../DashboardComponents/TitleContainer';
import AssetContainer from '../DashboardComponents/AssetContainer';

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
        <AssetContainer
          token={convertToFloatValue(assets?.borrowInfo.amount) + ' ' + assets?.assetInfo?.symbol}
          tokenValue={convertToFloatValue(assets?.borrowInfo.amountValue) + ' UST'}
        />
        <AssetContainer
          token={convertToFloatValue(assets?.collateralInfo?.collateral) + ' ' + assets?.collateralInfo?.csymbol}
          tokenValue={
            assets?.collateralInfo?.csymbol === 'UST'
              ? null
              : convertToFloatValue(assets?.collateralInfo?.collateralValue) + ' UST'
          }
        />
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
        <Header
          data={[
            { name: 'Borrowed', value: convertToFloatValue(getBorrowedTotal()) + ' UST' },
            { name: 'Collateral', value: convertToFloatValue(getCollateralTotal()) + ' UST' },
          ]}
        />
      </HeadingWrapper>
      <TitleContainer titles={MirrorBorrowTitle} />
      {getMirBorrow()}
    </Wrapper>
  );
};

export default ShortFarms;
