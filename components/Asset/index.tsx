import { AssetsTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from '../dashboardStyles';
import { convertToFloatValue  } from '../../utils/convertFloat';
import {plus} from "../../pages/api/mirror/utils";
const HEADING_TEXT = `Assets`;

export interface AssetsProps {
  mirrorAssets: MirrorAccount;
  ancAssets: AccountAnc;
  core: Core
}

const Assets: React.FC<AssetsProps> = ({ mirrorAssets, ancAssets, core}: AssetsProps) => {
  const getAssetsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.unstakedSum;
    const coreTotal = core?.total?.assetsSum;
    const total = plus(mirrorTotal, coreTotal);
    return total ?? '0';
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
      {[...core?.coins, ...mirrorAssets?.assets].map((asset: Coin) => (
        <Row key={asset.symbol}>
          <StyledText fontWeight={500}> {asset.symbol}</StyledText>
          <StyledText fontWeight={500}> {asset.name}</StyledText>
          <StyledText> {convertToFloatValue(asset.balance)}</StyledText>
          <StyledText> ${convertToFloatValue(asset.price)}</StyledText>
          <StyledText> ${convertToFloatValue(asset.value)}</StyledText>
        </Row>
      ))}
      {ancAssets?.assets?.map((a, index) => (
        <Row key={index}>
          <StyledText fontWeight={500}> {a?.symbol}</StyledText>
          <StyledText fontWeight={500}> {a?.symbol}</StyledText>
          <StyledText> {convertToFloatValue(a?.amount)}</StyledText>
          <StyledText> ${convertToFloatValue(a?.price)}</StyledText>
          <StyledText> ${(parseFloat(a?.amount) * parseFloat(a?.price)).toFixed(3)}</StyledText>
        </Row>
      ))}
    </Wrapper>
  );
};

export default Assets;
