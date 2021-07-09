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
  pylonAssets: PylonAccount;
}

const Total: React.FC<AssetsProps> = ({ ancAssets, mirrorAssets, core, pylonAssets}) => {
  const getLunaStakingRewards = () => {
    let total = 0;
    for (const a in core.staking) {
      total += parseFloat(core.staking[a]?.rewardsValue);
    }

    return total;
  };

  const getPoolTotal = () => {
    const total =
      parseFloat(mirrorAssets?.total?.mirrorPoolSum) +
      parseFloat(ancAssets?.total?.anchorPoolSum) +
      parseFloat(pylonAssets?.pylonSum?.pylonPoolSum);
    return total ?? 0;
  };

  const getGovStaked = () => {
    return parseFloat(ancAssets?.gov?.reward?.staked) * parseFloat(ancAssets?.gov?.price);
  };

  const getEarn = () => {
    return parseFloat(ancAssets?.earn?.reward?.staked);
  };

  const getAirdropTotal = () => {
    const mirrorTotal = parseFloat(mirrorAssets?.total?.mirrorAirdropSum ?? '0');
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
    const ancHoldingsTotal = ancAssets?.total?.anchorHoldingsSum;
    const pylonHoldingsTotal = pylonAssets.pylonSum.pylonHoldingsSum;
    const pylonStakingsTotal = pylonAssets.pylonSum.pylonStakingSum;
    const pylonGatewayDepositTotal = pylonAssets.pylonSum.gatewayDepositsSum;
    const mirrorTotal = mirrorAssets?.total?.mirrorHoldingsSum;
    const coreTotal = core?.total?.assetsSum;
    const total =
      parseFloat(plus(mirrorTotal, coreTotal)) +
      parseFloat(ancHoldingsTotal) +
      parseFloat(pylonHoldingsTotal) +
      parseFloat(pylonStakingsTotal) +
      parseFloat(pylonGatewayDepositTotal) +
      getLunaStakedTotal() +
      getPoolTotal() +
      getGovStaked() +
      getCollateralValue() +
      getEarn();
    return total.toFixed(3) ?? '0';
  };

  const getRewardsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.mirrorPoolRewardsSum;
    const pylonPoolRewardsTotal = pylonAssets?.pylonSum?.pylonPoolRewardsSum;
    const pylonStakingRewardsTotal = pylonAssets?.pylonSum?.pylonStakingRewardsSum;
    const pylonGatewayRewardsTotal = pylonAssets.pylonSum.gatewayRewardsSum;
    const total =
  parseFloat(pylonGatewayRewardsTotal) +  parseFloat(pylonPoolRewardsTotal)+parseFloat(pylonStakingRewardsTotal)+   parseFloat(mirrorTotal) + parseFloat(ancAssets?.totalReward) + getLunaStakingRewards() + getAirdropTotal();

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
