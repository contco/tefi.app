import { useEffect, useState } from 'react';
import { AssetsTitle } from '../../constants';
import { CheckBox, Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from '../dashboardStyles';
import { convertToFloatValue } from '../../utils/convertFloat';
import { plus } from '../../pages/api/mirror/utils';
import { Flex } from '@contco/core-ui';

const HEADING_TEXT = `Assets`;

export interface AssetsProps {
  mirrorAssets: MirrorAccount;
  ancAssets: AccountAnc;
  core: Core;
  pylonAssets: PylonAccount;
  spectrum: SpectrumAccount
}

const Assets: React.FC<AssetsProps> = ({ mirrorAssets, ancAssets, core, pylonAssets, spectrum}: AssetsProps) => {

  const [holdings, setHoldings] = useState<Holdings[]>([]);
  const [hideSmall, setHideSmall] = useState(true);

  const getAssetsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.mirrorHoldingsSum;
    const coreTotal = core?.total?.assetsSum;
    const pylonHoldingsSum = pylonAssets?.pylonSum?.pylonHoldingsSum;
    const spectrumSum = spectrum?.spectrumTotal?.holdingsTotal;
    const total = parseFloat(spectrumSum) + parseFloat(plus(mirrorTotal, coreTotal)) + parseFloat(ancAssets?.total?.anchorHoldingsSum) + parseFloat(pylonHoldingsSum);
    return convertToFloatValue(total.toString()) ?? '0';
  };

  useEffect(() => {
    const holdings = [ ...spectrum?.specHoldings, ...pylonAssets?.pylonHoldings, ...mirrorAssets?.mirrorHoldings, ...core?.coins, ...ancAssets?.assets];
    let sortedHoldings = holdings.sort((a: any, b: any) => b.value - a.value);
    if (hideSmall) sortedHoldings = sortedHoldings.filter((asset: Holdings) => parseFloat(asset?.value) >= 1);
    setHoldings(sortedHoldings);
  }, [spectrum, mirrorAssets, ancAssets, core, pylonAssets, hideSmall]);

  const handleChange = (e: any) => {
    setHideSmall(e.target.checked);
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Flex alignItems="flex-end">
          <StyledText>${getAssetsTotal()}</StyledText>
          <Flex justifyContent="center" alignItems="center">
            <CheckBox type="checkbox" onChange={handleChange} checked={hideSmall} />
            <StyledText pt={1}>Hide small balances</StyledText>
          </Flex>
        </Flex>
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
