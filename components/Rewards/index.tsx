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
  const borrowRewards = ancAssets?.debt?.reward;
  const govRewards = ancAssets?.gov?.reward;
  const poolRewards = ancAssets?.pool?.reward;

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

      <Row>
        <StyledText fontWeight="500"> {borrowRewards?.name}</StyledText>
        <StyledText>{borrowRewards?.staked ? parseFloat(borrowRewards?.staked).toFixed(3) : null}</StyledText>
        <StyledText css={CSS_APR}> {borrowRewards?.apy}%</StyledText>
        <StyledText>{borrowRewards?.reward} ANC</StyledText>
      </Row>
      <Row>
        <StyledText fontWeight="500"> {govRewards?.name}</StyledText>
        <StyledText>{govRewards?.staked ? parseFloat(govRewards?.staked).toFixed(3) + ' ANC' : null}</StyledText>
        <StyledText css={CSS_APR}> {govRewards?.apy}%</StyledText>
        <StyledText>
          Automatically <br />
          re-staked
        </StyledText>
      </Row>
      <Row>
        <StyledText fontWeight="500"> {poolRewards?.name}</StyledText>
        <StyledText isChildren={true}>
          {poolRewards?.staked ? parseFloat(poolRewards?.staked).toFixed(3) + ' LP' : null}
          <HoverText>
            {parseFloat(ancAssets?.pool?.anc).toFixed(3)} {'ANC'} <br />
            {parseFloat(ancAssets?.pool?.ust).toFixed(3)} {'UST'}
          </HoverText>
        </StyledText>
        <StyledText css={CSS_APR}> {poolRewards?.apy}%</StyledText>
        <StyledText>
          {poolRewards?.reward} {'ANC'}
        </StyledText>
      </Row>

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
