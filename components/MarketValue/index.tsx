import css from '@styled-system/css';
import { MarketTitles } from '../../constants';
import { plus } from '../../pages/api/mirror/utils';
import { Wrapper, Row, Title, StyledText } from '../dashboardStyles';
import { MarketValueList } from './dummy';

const CUTOM_TEXT_CSS = css({ fontWeight: 500, fontSize: [14, null, null, 20, null, null,null, 28] });

export interface AssetsProps {
  ancAssets: AccountAnc;
  mirrorAssets: MirrorAccount;
  core: Core;
  pylonAssets: PylonAccount;
}

const Total: React.SFC<AssetsProps> = ({ ancAssets, mirrorAssets, core, pylonAssets}) => {
  const getLunaStakingRewards = () => {
    let total = 0;
    for (const a in core.staking) {
      total += parseFloat(core.staking[a]?.rewardsValue);
    }

    return total;
  };

  const getPoolTotal = () => {
    const total =
      parseFloat(mirrorAssets?.total?.stakedSum) +
      parseFloat(ancAssets?.pool?.stakedValue) +
      parseFloat(ancAssets?.pool?.stakableValue) +
      parseFloat(pylonAssets?.pylonSum?.pylonPoolSum);
    return total ?? 0;
  };

  const getGovStaked = () => {
    return parseFloat(ancAssets?.gov?.reward?.staked) * parseFloat(ancAssets?.assets[0].price);
  };

  const getEarn = () => {
    return parseFloat(ancAssets?.earn?.reward?.staked);
  };

  const getAirdropTotal = () => {
    const mirrorTotal = parseFloat(mirrorAssets?.total?.airdropSum ?? '0');
    const anchorTotal = parseFloat(ancAssets?.total?.airdropSum ?? '0');
    const pylonTotal = parseFloat(pylonAssets?.pylonSum?.pylonAirdropSum ?? '0');
    const total = mirrorTotal + anchorTotal + pylonTotal;
    return total || 0;
  };

  const getLunaStakedTotal = () => {
    const total = core?.total?.stakedSum;
    return parseFloat(total) ?? 0;
  };

  const getCollateralValue = () => {
    return ancAssets?.debt?.collaterals
      ? (parseFloat(ancAssets?.debt?.collaterals[0]?.balance) / 1000000) * parseFloat(ancAssets?.debt?.price)
      : 0;
  };

  const getAssetsTotal = () => {
    const ancValue = (parseFloat(ancAssets?.assets[0].amount) * parseFloat(ancAssets?.assets[0].price)).toFixed(3);
    const pylonHoldingsTotal = pylonAssets.pylonSum.pylonHoldingsSum;
    const pylonStakingsTotal = pylonAssets.pylonSum.pylonStakingSum;
    const mirrorTotal = mirrorAssets?.total?.unstakedSum;
    const coreTotal = core?.total?.assetsSum;
    const total =
      parseFloat(plus(mirrorTotal, coreTotal)) +
      parseFloat(ancValue) +
      parseFloat(pylonHoldingsTotal) +
      parseFloat(pylonStakingsTotal) +
      getLunaStakedTotal() +
      getPoolTotal() +
      getGovStaked() +
      getCollateralValue() +
      getEarn();
    return total.toFixed(3) ?? '0';
  };

  const getRewardsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.rewardsSum;
    const pylonPoolRewardsTotal = pylonAssets?.pylonSum?.pylonPoolRewardsSum;
    const pylonStakingRewardsTotal = pylonAssets?.pylonSum?.pylonStakingRewardsSum;
    const total =
    parseFloat(pylonPoolRewardsTotal)+parseFloat(pylonStakingRewardsTotal)+   parseFloat(mirrorTotal) + parseFloat(ancAssets?.totalReward) + getLunaStakingRewards() + getAirdropTotal();

    return total.toFixed(3) ?? '0';
  };

  const totalAssets = getAssetsTotal();

  const totalBorrowing = parseFloat(ancAssets?.debt?.value).toFixed(3);

  const totalRewards = getRewardsTotal();

  const getTotalMarketValue = () => {
    const total = parseFloat(totalAssets) + parseFloat(totalRewards) - parseFloat(totalBorrowing);

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
