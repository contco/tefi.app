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
}

const Rewards: React.FC<RewardsProps> = ({ ancAssets, mirrorAssets }) => {
  const borrowRewards = ancAssets?.debt?.reward;
  const govRewards = ancAssets?.gov?.reward;
  const poolRewards = ancAssets?.pool?.reward;
  const ancPrice = ancAssets?.assets[0]?.price;

  const totalReward = ancAssets?.totalReward;

  const getRewardsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.rewardsSum;
    const total = (parseFloat(mirrorTotal) + parseFloat(totalReward)).toFixed(3);
    return total ?? 0;
  };

  const formatApr = (apr = '0') => {
    const aprPercentage = times(apr, 100);
    return parseFloat(aprPercentage).toFixed(2);
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
      {parseFloat(ancAssets.debt?.value) > 0 ? (
        <Row>
          <StyledText fontWeight="500"> {borrowRewards?.name}</StyledText>
          <StyledText>{borrowRewards?.staked ? parseFloat(borrowRewards?.staked).toFixed(3) : null}</StyledText>
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
      {poolRewards?.staked ? (
        <Row>
          <StyledText fontWeight="500"> {poolRewards?.name}</StyledText>
          <StyledText isChildren={true}>
            {parseFloat(poolRewards?.staked).toFixed(3) + ' LP'}
            <HoverText>
              {parseFloat(ancAssets?.pool?.anc).toFixed(3)} {'ANC'} <br />
              {parseFloat(ancAssets?.pool?.ust).toFixed(3)} {'UST'}
            </HoverText>
          </StyledText>
          <StyledText css={CSS_APR}> {poolRewards?.apy}%</StyledText>
          <div>
            <StyledText>
              {poolRewards?.reward} {'ANC'}
            </StyledText>

            <SubText>
              $
              {poolRewards?.reward === '<0.001'
                ? 0
                : (parseFloat(poolRewards?.reward) * parseFloat(ancPrice)).toFixed(3)}
            </SubText>
          </div>
        </Row>
      ) : null}
      {mirrorAssets?.mirrorStaking.map((assets: MirrorStaking, index: number) => (
        <Row key={index}>
          <StyledText fontWeight="500"> {assets?.name}</StyledText>
          <StyledText isChildren={true}>
            {' '}
            {parseFloat(assets?.lpBalance)} LP
            <HoverText>
              {parseFloat(assets?.tokenStaked).toFixed(3)} {assets?.symbol} <br />
              {parseFloat(assets?.ustStaked).toFixed(3)} {'UST'}
            </HoverText>
          </StyledText>
          <StyledText css={CSS_APR}> {formatApr(assets?.apr)}%</StyledText>
          <StyledText>${parseFloat(assets?.rewardsUstValue).toFixed(3)}</StyledText>
        </Row>
      ))}
    </Wrapper>
  );
};

export default Rewards;
