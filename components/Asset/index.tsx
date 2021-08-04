import { useEffect, useState } from 'react';
import Link from 'next/link'
import { AssetsTitle } from '../../constants';
import { CheckBox, Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from '../dashboardStyles';
import { convertToFloatValue } from '../../utils/convertFloat';
import { plus } from '../../pages/api/mirror/utils';
import { Flex } from '@contco/core-ui';
import { assets } from '../../constants/assets';
import { NewOpenIcon } from '../Icons';

const HEADING_TEXT = `Assets`;
const HIDE_KEY = "hide_small";
const HIDDEN_STATE = "hidden";
const SMALL_VISIBLE_STATE = "visible";
const LINK_ICON_WIDTH = 16;
const LINK_ICON_HEIGHT = 12;

export interface AssetsProps {
  mirrorAssets: MirrorAccount;
  ancAssets: AccountAnc;
  core: Core;
  pylonAssets: PylonAccount;
  spectrum: SpectrumAccount
}

const Assets: React.FC<AssetsProps> = ({ mirrorAssets, ancAssets, core, pylonAssets, spectrum }: AssetsProps) => {

  const [holdings, setHoldings] = useState<Holdings[]>([]);
  const [hideSmall, setHideSmall] = useState(false);

  useEffect(() => {
    const localHideSmallState = localStorage.getItem(HIDE_KEY);
    setHideSmall(localHideSmallState === HIDDEN_STATE);
  }, []);

  const getAssetsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.mirrorHoldingsSum;
    const coreTotal = core?.total?.assetsSum;
    const pylonHoldingsSum = pylonAssets?.pylonSum?.pylonHoldingsSum;
    const spectrumSum = spectrum?.spectrumTotal?.holdingsTotal;
    const total = parseFloat(spectrumSum) + parseFloat(plus(mirrorTotal, coreTotal)) + parseFloat(ancAssets?.total?.anchorHoldingsSum) + parseFloat(pylonHoldingsSum);
    return convertToFloatValue(total.toString()) ?? '0';
  };

  useEffect(() => {
    const holdings = [...spectrum?.specHoldings, ...pylonAssets?.pylonHoldings, ...mirrorAssets?.mirrorHoldings, ...core?.coins, ...ancAssets?.assets];
    let sortedHoldings = holdings.sort((a: any, b: any) => b.value - a.value);
    if (hideSmall) sortedHoldings = sortedHoldings.filter((asset: Holdings) => parseFloat(asset?.value) >= 1);
    setHoldings(sortedHoldings);
  }, [spectrum, mirrorAssets, ancAssets, core, pylonAssets, hideSmall]);

  const handleChange = (e: any) => {
    setHideSmall(e.target.checked);
    const hiddenState = e.target.checked ? HIDDEN_STATE : SMALL_VISIBLE_STATE;
    localStorage.setItem(HIDE_KEY, hiddenState);
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
          <StyledText
            fontWeight={500}
            isURL={assets[asset.symbol.toLowerCase()]}
          >
            {assets[asset.symbol.toLowerCase()] ?
              <Link href={assets[asset.symbol.toLowerCase()] ? `/market/${asset.symbol.toLowerCase()}/` : '#'}>
                <a target="_blank" >
                  {asset.symbol}
                </a>
              </Link>
              :
              asset.symbol
            }
            {assets[asset.symbol.toLowerCase()] && <NewOpenIcon visibility='hidden' width={LINK_ICON_WIDTH} height={LINK_ICON_HEIGHT} />}
          </StyledText>
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
