import { AssetsTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText } from '../dashboardStyles';
import { convertToFloatValue } from '../../utils/convertFloat';
import { plus } from '../../pages/api/mirror/utils';
import { Flex } from '@contco/core-ui';
import { useState } from 'react';

const HEADING_TEXT = `Assets`;

export interface AssetsProps {
  mirrorAssets: MirrorAccount;
  ancAssets: AccountAnc;
  core: Core;
}

const Assets: React.FC<AssetsProps> = ({ mirrorAssets, ancAssets, core }: AssetsProps) => {
  const [totalAssets, setTotalAssets] = useState(
    parseFloat(ancAssets.assets.value) > 0
      ? [...core?.coins, ...mirrorAssets?.mirrorHoldings, ancAssets?.assets]
      : [...core?.coins, ...mirrorAssets?.mirrorHoldings],
  );

  const getAssetsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.unstakedSum;
    const coreTotal = core?.total?.assetsSum;
    const total = parseFloat(plus(mirrorTotal, coreTotal)) + parseFloat(ancAssets.assets.value);
    return total.toFixed(3) ?? '0';
  };

  const handleChange = (e: any) => {
    if (e.target.checked) {
      const largerAssets = totalAssets.filter((asset: Coin) => parseFloat(asset?.value) >= 1);
      setTotalAssets(largerAssets);
    } else {
      setTotalAssets(
        parseFloat(ancAssets.assets.value) > 0
          ? [...core?.coins, ...mirrorAssets?.mirrorHoldings, ancAssets?.assets]
          : [...core?.coins, ...mirrorAssets?.mirrorHoldings],
      );
    }
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <Flex>
          <StyledText>${getAssetsTotal()}</StyledText>
          <Flex alignItems="center" justifyContent="space-between">
            <input type="checkbox" onChange={handleChange} />
            <StyledText>Hide small balances</StyledText>
          </Flex>
        </Flex>
      </HeadingWrapper>
      <Row>
        {AssetsTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {totalAssets.map((asset: Coin) => (
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
