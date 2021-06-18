import css from '@styled-system/css';
import { RewardsTitle } from '../../constants';
import { Wrapper, Row, HeadingWrapper, Heading, Title, StyledText, HoverText } from '../dashboardStyles';
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
  const poolRewards = ancAssets?.pool?.reward;
  const borrowRewards = ancAssets?.debt?.reward;
  const govRewards = ancAssets?.gov?.reward;

  const rewards = [poolRewards, borrowRewards, govRewards];
  const getRewardsTotal = () => {
    const mirrorTotal = mirrorAssets?.total?.rewardsSum;
    return mirrorTotal ?? '0';
  };

  const formatApr = (apr = '0') => {
    const aprPercentage = times(apr, 100);
    return parseFloat(aprPercentage).toFixed(2);
  };

  return (
    <Wrapper>
      <HeadingWrapper>
        <Heading>{HEADING_TEXT}</Heading>
        <StyledText>${parseInt(getRewardsTotal()).toFixed(3)}</StyledText>
      </HeadingWrapper>
      <Row>
        {RewardsTitle.map((t, index) => (
          <Title key={index}>{t}</Title>
        ))}
      </Row>
      {rewards?.map((a: Reward, index) => (
        <Row key={index}>
          <StyledText fontWeight="500"> {a?.name}</StyledText>
          <StyledText isChildren={true}> {parseFloat(a?.staked).toFixed(3)}</StyledText>
          <StyledText css={CSS_APR}> {formatApr(a?.apy)}%</StyledText>
          <StyledText>{a?.reward}</StyledText>
        </Row>
      ))}
      {mirrorAssets?.assets.map((assets: MirrorAccountAssets, index: number) => (
        <Row key={index}>
          <StyledText fontWeight="500"> {assets?.name}</StyledText>
          <StyledText isChildren={true}>
            {' '}
            {parseFloat(assets?.lpBalance)} LP
            <HoverText>
              {parseFloat(assets?.tokenStaked).toFixed(3)}{" "} {assets?.symbol} <br />
              {parseFloat(assets?.ustStaked).toFixed(3)} {" "} {'UST'}
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
