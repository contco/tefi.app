import { RewardsTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText, SubText, CSS_APR } from '../dashboardStyles';
import { times } from '../../pages/api/mirror/utils';
import { convertToFloatValue } from '../../utils/convertFloat';
import { Box } from '@contco/core-ui';
const HEADING_TEXT = `Rewards`;
export interface RewardsProps {
  ancAssets: AccountAnc;
  mirrorAssets: MirrorAccount;
  pylonAssets: PylonAccount;
}

const Rewards: React.FC<RewardsProps> = ({ ancAssets, mirrorAssets, pylonAssets }) => {
  const borrowRewards = ancAssets?.debt?.reward;
  const govRewards = ancAssets?.gov?.reward;
  const ancPrice = ancAssets?.gov.price;

  const totalReward = ancAssets?.totalReward;

  const getRewardsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.mirrorPoolRewardsSum;
    const pylonStakingTotal = pylonAssets?.pylonSum?.pylonStakingRewardsSum;
    const pylonPoolTotal = pylonAssets?.pylonSum?.pylonPoolRewardsSum;
    const total = (
      parseFloat(mirrorTotal) +
      parseFloat(totalReward) +
      parseFloat(pylonStakingTotal) +
      parseFloat(pylonPoolTotal)
    );
    return convertToFloatValue(total.toString()) ?? 0;
  };

  const formatApr = (apr = '0') => {
    const aprPercentage = times(apr, 100);
    return parseFloat(aprPercentage).toFixed(2);
  };

  const getPool = () => {
      const pool = [...pylonAssets?.pylonPool, ...mirrorAssets?.mirrorStaking, ...ancAssets.pool].sort(
        (a, b) => b.rewardsValue - a.rewardsValue,
      );
      if(pool && pool.length > 0) {
      return pool.map((assets: Pool, index: number) => (
        <Row key={index}>
          <StyledText fontWeight="500"> {assets?.lpName}</StyledText>
          <StyledText isChildren={true}>
            {' '}
            {convertToFloatValue(assets?.stakedLP)} LP
            <HoverText>
              {convertToFloatValue(assets?.tokenStaked)} {assets?.symbol} <br />
              {convertToFloatValue(assets?.ustStaked)} {'UST'}
            </HoverText>
          </StyledText>
          <div>
            <StyledText css={CSS_APR}> {assets?.apy ? formatApr(assets?.apy) : formatApr(assets?.apr)}%</StyledText>
            {assets?.apy ? <SubText> (APY)</SubText> : null}
          </div>
          <div>
            <StyledText>
              {convertToFloatValue(assets?.rewards)} {assets?.rewardsSymbol}
            </StyledText>
            <SubText>${convertToFloatValue(assets?.rewardsValue)}</SubText>
          </div>
        </Row>
      ));
    }
    return null;
  };

  const getPylonStakingRewards = () => {
    if (pylonAssets?.pylonStakings) {
      return pylonAssets?.pylonStakings.map((assets: PylonStakings, index: number) => (
        <Row key={index}>
          <StyledText fontWeight="500"> {assets?.symbol}</StyledText>
          <div>
            <StyledText>
              {convertToFloatValue(assets?.balance)} {assets?.symbol}
            </StyledText>
            <SubText>${convertToFloatValue(assets.stakedValue)}</SubText>
          </div>
          <div>
            <StyledText css={CSS_APR}> {formatApr(assets?.apy)}%</StyledText>
            <SubText> (APY)</SubText>
          </div>
          <div>
            <StyledText>
              {convertToFloatValue(assets?.rewards)} {assets?.symbol}
            </StyledText>
            <SubText>${convertToFloatValue(assets?.rewardsValue)}</SubText>
          </div>
        </Row>
      ));
    }
    return null;
  };
  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${getRewardsTotal()}</StyledText>
      </HeadingWrapper>
      <Row>
        {RewardsTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {getPool()}
      {getPylonStakingRewards()}
      {parseFloat(ancAssets.debt?.value) > 0 ? (
        <Row>
          <StyledText fontWeight="500"> {borrowRewards?.name}</StyledText>
          <StyledText>{'N/A'}</StyledText>
          <StyledText css={CSS_APR}> {borrowRewards?.apy}%</StyledText>
          <Box>
            <StyledText>{borrowRewards?.reward} ANC</StyledText>
            <SubText>
              $
              {borrowRewards?.reward === '<0.001'
                ? 0
                : (parseFloat(borrowRewards?.reward) * parseFloat(ancPrice)).toFixed(3)}
            </SubText>
          </Box>
        </Row>
      ) : null}
      {govRewards?.staked && parseFloat(govRewards?.staked) > 0 ? (
        <Row>
          <StyledText fontWeight="500"> {govRewards?.name}</StyledText>
          <StyledText> {convertToFloatValue(govRewards?.staked) + ' ANC'}</StyledText>
          <StyledText css={CSS_APR}> {govRewards?.apy}%</StyledText>
          <StyledText>
            Automatically <br />
            re-staked
          </StyledText>
        </Row>
      ) : null}
    </Wrapper>
  );
};

export default Rewards;
