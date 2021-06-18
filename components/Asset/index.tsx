import { AssetsTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from '../dashboardStyles';
const HEADING_TEXT = `Assets`;

export interface AssetsProps {
  mirrorAssets: MirrorAccount;
  ancAssets: AccountAnc;
  coins: Array<Coin>
}

const Assets: React.FC<AssetsProps> = ({ mirrorAssets, ancAssets, coins}: AssetsProps) => {
  const getAssetsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.unstakedSum;
    return mirrorTotal ?? '0';
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${parseInt(getAssetsTotal()).toFixed(3)}</StyledText>
      </HeadingWrapper>
      <Row>
        {AssetsTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {[...coins, ...mirrorAssets?.assets].map((asset: Coin) => (
        <Row key={asset.symbol}>
          <StyledText fontWeight={500}> {asset.symbol}</StyledText>
          <StyledText fontWeight={500}> {asset.name}</StyledText>
          <StyledText> {parseFloat(asset.amount).toFixed(3)}</StyledText>
          <StyledText> ${parseFloat(asset.price).toFixed(3)}</StyledText>
          <StyledText> ${parseFloat(asset.balance).toFixed(3)}</StyledText>
        </Row>
      ))}
      {ancAssets?.assets?.map((a, index) => (
        <Row key={index}>
          <StyledText fontWeight={500}> {a?.symbol}</StyledText>
          <StyledText fontWeight={500}> {a?.symbol}</StyledText>
          <StyledText> {parseFloat(a?.amount).toFixed(3)}</StyledText>
          <StyledText> ${parseFloat(a?.price).toFixed(3)}</StyledText>
          <StyledText> ${(parseFloat(a?.amount) * parseFloat(a?.price)).toFixed(3)}</StyledText>
        </Row>
      ))}
    </Wrapper>
  );
};

export default Assets;
