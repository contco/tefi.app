import css from '@styled-system/css';
import { MarketTitles } from '../../constants';
import { plus } from '../../pages/api/mirror/utils';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Wrapper, Row, Title, StyledText } from '../dashboardStyles';

const CUTOM_TEXT_CSS = css({ fontWeight: 500, fontSize: [14, null, null, 20, null, null, null, 28] });

export interface AssetsProps {
  ancAssets: AccountAnc;
  mirrorAssets: MirrorAccount;
  core: Core;
  pylonAssets: PylonAccount;
  spectrum: SpectrumAccount
}

const Total: React.FC<AssetsProps> = ({ ancAssets, mirrorAssets, core, pylonAssets, spectrum }) => {
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
      parseFloat(spectrum?.spectrumTotal?.farmsTotal) +
      parseFloat(pylonAssets?.pylonSum?.pylonPoolSum);
    return total ?? 0;
  };

  const getGovStaked = () => {
    const ancGov = parseFloat(ancAssets?.gov?.value ?? '0');
    const mirrorGov = parseFloat(mirrorAssets?.gov?.value ?? '0');
    const pylonGov = parseFloat(pylonAssets?.gov?.value ?? '0');
    const specGov = parseFloat(spectrum?.specGov?.value ?? '0');
    const govStaked = mirrorGov + ancGov + pylonGov + specGov;
    return govStaked;
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
      ? (parseFloat(ancAssets?.debt?.collaterals[0]?.balance) / 1000000) * parseFloat(ancAssets?.debt?.lunaprice)
      : 0;
  };

  const getAssetsTotal = () => {
    const ancValue = ancAssets?.total?.anchorHoldingsSum;
    const pylonHoldingsTotal = pylonAssets?.pylonSum?.pylonHoldingsSum;
    const pylonGatewayDepositTotal = pylonAssets?.pylonSum?.gatewayDepositsSum;
    const mirrorTotal = mirrorAssets?.total?.mirrorHoldingsSum;
    const coreTotal = core?.total?.assetsSum;

    const total =
      parseFloat(spectrum?.spectrumTotal?.holdingsTotal) +
      parseFloat(plus(mirrorTotal, coreTotal)) +
      parseFloat(ancValue) +
      parseFloat(pylonHoldingsTotal) +
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
    const pylonGatewayRewardsTotal = pylonAssets.pylonSum.gatewayRewardsSum;
    const spectrumRewardsTotal = spectrum?.spectrumTotal?.rewardsTotal;
    const total =
      parseFloat(spectrumRewardsTotal) +
      parseFloat(pylonGatewayRewardsTotal) +
      parseFloat(pylonPoolRewardsTotal) +
      parseFloat(mirrorTotal) +
      parseFloat(ancAssets?.totalReward) +
      getLunaStakingRewards() +
      getAirdropTotal();

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
      <Row>
        <StyledText css={CUTOM_TEXT_CSS}>${convertToFloatValue(totalMarketValue)}</StyledText>
        <StyledText css={CUTOM_TEXT_CSS}>${convertToFloatValue(totalAssets)}</StyledText>
        <StyledText css={CUTOM_TEXT_CSS}>${convertToFloatValue(totalBorrowing)}</StyledText>
        <StyledText css={CUTOM_TEXT_CSS}>${convertToFloatValue(totalRewards)}</StyledText>
      </Row>
    </Wrapper>
  );
};

export default Total;
