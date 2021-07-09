import { useEffect, useState } from 'react';
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

  const [holdings, setHoldings] = useState<Holdings[]>([]);

  const getAssetsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.mirrorHoldingsSum;
    const coreTotal = core?.total?.assetsSum;
    const pylonHoldingsSum = pylonAssets?.pylonSum?.pylonHoldingsSum;
    const total = parseFloat(plus(mirrorTotal, coreTotal)) + parseFloat(ancAssets?.total?.anchorHoldingsSum) + parseFloat(pylonHoldingsSum);
    return total.toFixed(3) ?? '0';
  };

  useEffect(() => {
    const holdings = [ ...pylonAssets?.pylonHoldings, ...mirrorAssets?.mirrorHoldings, ...core?.coins, ...ancAssets?.assets];
    const sortedHoldings = holdings.sort((a: any,b: any) => b.value - a.value);
    setHoldings(sortedHoldings);
  }, [mirrorAssets, ancAssets, core,pylonAssets]);

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
      {holdings.map((asset: Holdings) => (
        <Row key={asset.symbol}>
          <StyledText fontWeight={500}> {asset.symbol}</StyledText>
          <StyledText fontWeight={500}> {asset.name}</StyledText>
          <StyledText> {convertToFloatValue(asset.balance)}</StyledText>
          <StyledText> ${convertToFloatValue(asset.price)}</StyledText>
          <StyledText> ${convertToFloatValue(asset.value)}</StyledText>
        </Row>
      ))}
    </Wrapper>
  );
};

export default Assets;
