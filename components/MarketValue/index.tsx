import css from '@styled-system/css';
import { MarketTitles } from '../../constants';
import { plus } from '../../pages/api/mirror/utils';
import { Wrapper, Row, Title, StyledText } from '../dashboardStyles';
import { MarketValueList } from './dummy';

const CUTOM_TEXT_CSS = css({ fontWeight: 500, fontSize: [16, null, 18, null, 28] });

export interface AssetsProps {
  ancAssets: AccountAnc;
  mirrorAssets: MirrorAccount;
  core: Core;
}

const Total: React.SFC<AssetsProps> = ({ ancAssets, mirrorAssets, core }) => {
  const getAssetsTotal = () => {
    const ancValue = (parseFloat(ancAssets?.assets[0].amount) * parseFloat(ancAssets?.assets[0].price)).toFixed(3);

    const mirrorTotal = mirrorAssets?.total?.unstakedSum;
    const coreTotal = core?.total?.assetsSum;
    const total = parseFloat(plus(mirrorTotal, coreTotal)) + parseFloat(ancValue);
    return total.toFixed(3) ?? '0';
  };

  const getRewardsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.rewardsSum;
    const total = (parseFloat(mirrorTotal) + parseFloat(ancAssets?.totalReward)).toFixed(3);
    return total ?? '0';
  };

  const getPoolTotal = () => {
    const total = (parseFloat(mirrorAssets?.total?.stakedSum) + parseFloat(ancAssets?.pool?.value)).toFixed(3);
    return total ?? '0';
  };

  const getAirdropTotal = () => {
    const mirrorTotal = parseFloat(mirrorAssets?.total?.airdropSum ?? '0');
    const anchorTotal = parseFloat(ancAssets?.total?.airdropSum ?? '0');
    const total = (mirrorTotal + anchorTotal).toFixed(3);
    return total;
  };

  const getStakedTotal = () => {
    const total = core?.total?.stakedSum;
    return total ?? '0';
  };

  const totalAssets = getAssetsTotal();

  const totalBorrowing = parseFloat(ancAssets?.debt?.value).toFixed(3);

  const totalRewards = getRewardsTotal();

  const collateralValue = ancAssets?.debt?.collaterals
    ? (parseFloat(ancAssets?.debt?.collaterals[0]?.balance) / 1000000) * parseFloat(ancAssets?.debt?.price)
    : 0;

  const getTotalMarketValue = () => {
    const otherTotals =
      parseFloat(ancAssets?.earn?.reward?.staked) +
      parseFloat(ancAssets?.gov?.reward?.staked) * parseFloat(ancAssets?.assets[0].price) +
      collateralValue;

    const total =
      parseFloat(totalAssets) +
      parseFloat(totalRewards) -
      parseFloat(totalBorrowing) +
      parseFloat(getPoolTotal()) +
      parseFloat(getAirdropTotal()) +
      parseFloat(getStakedTotal()) +
      otherTotals;

    return total;
  };

  const totalMarketValue = getTotalMarketValue().toFixed(3);

  return (
    <Wrapper>
      <Row>
        {MarketTitles.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {MarketValueList.map((a, index) => (
        <Row key={index}>
          <StyledText css={CUTOM_TEXT_CSS}>${totalMarketValue}</StyledText>
          <StyledText css={CUTOM_TEXT_CSS}>${totalAssets}</StyledText>
          <StyledText css={CUTOM_TEXT_CSS}>${totalBorrowing}</StyledText>
          <StyledText css={CUTOM_TEXT_CSS}>${totalRewards}</StyledText>
        </Row>
      ))}
    </Wrapper>
  );
};

export default Total;
