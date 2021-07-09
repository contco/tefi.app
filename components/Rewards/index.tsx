import css from '@styled-system/css';
import { RewardsTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText, SubText } from '../dashboardStyles';
import { times } from '../../pages/api/mirror/utils';
const HEADING_TEXT = `Rewards`;

const CSS_APR = (props) =>
  css({
    fontWeight: 500,
    color: props.theme.colors.secondary,
  });

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
    const total = (parseFloat(mirrorTotal) + parseFloat(totalReward) + parseFloat(pylonStakingTotal) + parseFloat(pylonPoolTotal)).toFixed(3);
    return total ?? 0;
  };

  const formatApr = (apr = '0') => {
    const aprPercentage = times(apr, 100);
    return parseFloat(aprPercentage).toFixed(2);
  };

  const getPool = () => {
    if(pylonAssets?.pylonPool) {
      const pool = [...pylonAssets?.pylonPool, ...mirrorAssets?.mirrorStaking, ...ancAssets.pool].sort((a,b) => b.rewardsValue - a.rewardsValue);
    return pool.map((assets: Pool, index: number) => (
      <Row key={index}>
        <StyledText fontWeight="500"> {assets?.lpName}</StyledText>
        <StyledText isChildren={true}>
          {' '}
          {parseFloat(assets?.stakedLP).toFixed(3)} LP
          <HoverText>
              {parseFloat(assets?.tokenStaked).toFixed(3)} {assets?.symbol} <br />
              {parseFloat(assets?.ustStaked).toFixed(3)} {'UST'}
          </HoverText>
        </StyledText>
        <div>
        <StyledText css={CSS_APR}> {assets?.apy ? formatApr(assets?.apy): formatApr(assets?.apr)}%</StyledText>
        {assets?.apy ? <SubText> (APY)</SubText> : null }
        </div>
        <div>
        <StyledText>{parseFloat(assets?.rewards).toFixed(3)} {assets?.symbol}</StyledText>
        <SubText>${parseFloat(assets?.rewardsValue).toFixed(3)}</SubText>
        </div>
      </Row>
    ))
    }
    return null;
  }

  const getPylonStakingRewards = () => {
    if(pylonAssets?.pylonStakings) {
    return pylonAssets?.pylonStakings.map((assets: PylonStakings, index: number) => (
      <Row key={index}>
        <StyledText fontWeight="500"> {assets?.symbol}</StyledText>
        <div>
        <StyledText>
          {parseFloat(assets?.balance).toFixed(3)} {assets?.symbol}
        </StyledText>
        <SubText>${parseFloat(assets.stakedValue).toFixed(3)}</SubText>
        </div>
        <div>
        <StyledText css={CSS_APR}> {formatApr(assets?.apy)}%</StyledText>
        <SubText> (APY)</SubText>
        </div>
        <div>
        <StyledText>{parseFloat(assets?.rewards).toFixed(3)} {assets?.symbol}</StyledText>
        <SubText>${parseFloat(assets?.rewardsValue).toFixed(3)}</SubText>
        </div>
      
      </Row>
    ))
    }
    return null;
  }
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
          <StyledText>{borrowRewards?.staked ? parseFloat(borrowRewards?.staked).toFixed(3) : "N/A"}</StyledText>
          <StyledText css={CSS_APR}> {borrowRewards?.apy}%</StyledText>
          <div>
            <StyledText>{borrowRewards?.reward} ANC</StyledText>
            <SubText>
              $
              {borrowRewards?.reward === '<0.001'
                ? 0
                : (parseFloat(borrowRewards?.reward) * parseFloat(ancPrice)).toFixed(3)}
            </SubText>
          </div>
        </Row>
      ) : null}
      {govRewards?.staked ? (
        <Row>
          <StyledText fontWeight="500"> {govRewards?.name}</StyledText>
          <StyledText>{govRewards?.staked ? parseFloat(govRewards?.staked).toFixed(3) + ' ANC' : null}</StyledText>
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
