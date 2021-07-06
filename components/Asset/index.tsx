import { AssetsTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from '../dashboardStyles';
import { convertToFloatValue } from '../../utils/convertFloat';
import { plus } from '../../pages/api/mirror/utils';
const HEADING_TEXT = `Assets`;

export interface AssetsProps {
  mirrorAssets: MirrorAccount;
  ancAssets: AccountAnc;
  core: Core;
  pylonAssets: PylonAccount
}

const Assets: React.FC<AssetsProps> = ({ mirrorAssets, ancAssets, core, pylonAssets }: AssetsProps) => {
  const ancAsset = ancAssets.assets[0];
  const ancValue = (parseFloat(ancAsset?.amount) * parseFloat(ancAsset?.price)).toFixed(3);

  const getAssetsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.unstakedSum;
    const coreTotal = core?.total?.assetsSum;
    const total = parseFloat(plus(mirrorTotal, coreTotal)) + parseFloat(ancValue);
    return total.toFixed(3) ?? '0';
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${getAssetsTotal()}</StyledText>
      </HeadingWrapper>
      <Row>
        {AssetsTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {[ ...pylonAssets?.pylonHoldings, ...mirrorAssets?.mirrorHoldings, ...core?.coins].map((asset: Coin) => (
        <Row key={asset.symbol}>
          <StyledText fontWeight={500}> {asset.symbol}</StyledText>
          <StyledText fontWeight={500}> {asset.name}</StyledText>
          <StyledText> {convertToFloatValue(asset.balance)}</StyledText>
          <StyledText> ${convertToFloatValue(asset.price)}</StyledText>
          <StyledText> ${convertToFloatValue(asset.value)}</StyledText>
        </Row>
      ))}
      {parseFloat(ancAsset.amount) > 0 ? (
        <Row>
          <StyledText fontWeight={500}> {ancAsset?.symbol}</StyledText>
          <StyledText fontWeight={500}> {'Anchor'}</StyledText>
          <StyledText> {parseFloat(ancAsset?.amount).toFixed(3)} ANC</StyledText>
          <StyledText> ${parseFloat(ancAsset?.price).toFixed(3)}</StyledText>
          <StyledText>${ancValue}</StyledText>
        </Row>
      ) : null}
    </Wrapper>
  );
};

export default Assets;
